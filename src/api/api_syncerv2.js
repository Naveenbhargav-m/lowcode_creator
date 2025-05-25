// api/api_syncer.js

import { AppID } from "../states/global_state";

/**
 * Enhanced API syncer with proper CRUD operations
 */

// Base configuration
const API_BASE_URL = "http://localhost:8001/api" || '/api';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Generic API request handler with error handling
 */
async function makeAPIRequest(url, options = {}) {
  try {
    const config = {
      headers: DEFAULT_HEADERS,
      ...options,
    };

    // @ts-ignore
    console.log(`API Request: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    // Handle different response status codes
    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const parsedError = JSON.parse(errorData);
        errorMessage = parsedError.message || parsedError.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use the text as error message
        if (errorData) {
          errorMessage = errorData;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const responseText = await response.text();
    if (!responseText) {
      return null;
    }

    // Try to parse JSON response
    try {
      return JSON.parse(responseText);
    } catch (e) {
      // If not JSON, return the text
      return responseText;
    }
    
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
}

/**
 * GET request - Retrieve data
 */
async function GetDataFromAPi(endpoint) {
  const url = `${API_BASE_URL}/${endpoint}`;
  return await makeAPIRequest(url, {
    method: 'GET',
  });
}

/**
 * POST request - Create new data
 */
async function CreateDataToAPI(endpoint, data) {
  const url = `${API_BASE_URL}/${endpoint}`;
  return await makeAPIRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request - Update existing data
 */
async function UpdateDataToAPI(endpoint, data) {
  const url = `${API_BASE_URL}/${endpoint}`;
  return await makeAPIRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH request - Partial update
 */
async function PatchDataToAPI(endpoint, data) {
  const url = `${API_BASE_URL}/${endpoint}`;
  return await makeAPIRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request - Delete data
 */
async function DeleteDataFromAPI(endpoint) {
  const url = `${API_BASE_URL}/${endpoint}`;
  return await makeAPIRequest(url, {
    method: 'DELETE',
  });
}

/**
 * Legacy sync function - now deprecated but kept for backward compatibility
 * @deprecated Use specific CRUD functions instead
 */
async function SyncData(endpoint, data, method = 'POST') {
  console.warn('SyncData is deprecated. Use specific CRUD functions instead.');
  
  if (method === 'POST') {
    return await CreateDataToAPI(endpoint, data);
  } else if (method === 'PUT') {
    return await UpdateDataToAPI(endpoint, data);
  } else if (method === 'DELETE') {
    return await DeleteDataFromAPI(endpoint);
  } else {
    throw new Error(`Unsupported method: ${method}`);
  }
}

/**
 * Bulk operations for handling multiple items
 */
async function BulkCreateData(endpoint, dataArray) {
  const url = `${API_BASE_URL}/${endpoint}/bulk`;
  return await makeAPIRequest(url, {
    method: 'POST',
    body: JSON.stringify({ items: dataArray }),
  });
}

async function BulkUpdateData(endpoint, dataArray) {
  const url = `${API_BASE_URL}/${endpoint}/bulk`;
  return await makeAPIRequest(url, {
    method: 'PUT',
    body: JSON.stringify({ items: dataArray }),
  });
}

async function BulkDeleteData(endpoint, idsArray) {
  const url = `${API_BASE_URL}/${endpoint}/bulk`;
  return await makeAPIRequest(url, {
    method: 'DELETE',
    body: JSON.stringify({ ids: idsArray }),
  });
}

/**
 * Template-specific API functions
 */
class TemplateAPI {
  static async getAll() {
    return await GetDataFromAPi('_templates');
  }

  static async getById(id) {
    return await GetDataFromAPi(`_templates/${id}`);
  }

  static async create(templateData) {
    return await CreateDataToAPI('_templates', templateData);
  }

  static async update(id, templateData) {
    return await UpdateDataToAPI(`_templates/${id}`, templateData);
  }

  static async delete(id) {
    return await DeleteDataFromAPI(`_templates/${id}`);
  }

  static async duplicate(id, newName) {
    return await CreateDataToAPI(`_templates/${id}/duplicate`, { name: newName });
  }

  static async reorder(orderedIds) {
    return await UpdateDataToAPI('_templates/reorder', { order: orderedIds });
  }
}

/**
 * Request queue for handling multiple simultaneous requests
 */
class RequestQueue {
  constructor(maxConcurrent = 3) {
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request: requestFn,
        resolve,
        reject,
      });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { request, resolve, reject } = this.queue.shift();

    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process(); // Process next item in queue
    }
  }
}

// Global request queue instance
const globalRequestQueue = new RequestQueue(3);

/**
 * Queued API requests to prevent overwhelming the server
 */
async function QueuedAPIRequest(requestFn) {
  return await globalRequestQueue.add(requestFn);
}

/**
 * Retry mechanism for failed requests
 */
async function RetryAPIRequest(requestFn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP 4')) {
        throw error;
      }
      
      if (i < maxRetries) {
        console.warn(`Request failed, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

/**
 * Cache mechanism for GET requests
 */
class APICache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

// Global cache instance
const globalAPICache = new APICache();

/**
 * Cached GET request
 */
async function GetDataFromAPiCached(endpoint, useCache = true) {
  if (useCache) {
    const cached = globalAPICache.get(endpoint);
    if (cached) {
      console.log(`Cache hit for ${endpoint}`);
      return cached;
    }
  }
  
  const data = await GetDataFromAPi(endpoint);
  
  if (useCache && data) {
    globalAPICache.set(endpoint, data);
  }
  
  return data;
}

// Export all functions
export {
  // Core CRUD operations
  GetDataFromAPi,
  CreateDataToAPI,
  UpdateDataToAPI,
  PatchDataToAPI,
  DeleteDataFromAPI,
  
  // Bulk operations
  BulkCreateData,
  BulkUpdateData,
  BulkDeleteData,
  
  // Template-specific API
  TemplateAPI,
  
  // Utility functions
  QueuedAPIRequest,
  RetryAPIRequest,
  GetDataFromAPiCached,
  
  // Legacy function (deprecated)
  SyncData,
  
  // Cache management
  globalAPICache,
  
  // Queue management
  globalRequestQueue,
};

// Export classes for advanced usage
export { RequestQueue, APICache };