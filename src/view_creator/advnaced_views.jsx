import { useState, useEffect } from 'react';
import { Play, History, Star, Clock, Save, Trash, Download, Copy, ChevronDown } from 'lucide-react';
import { TablesTab } from '../table_builder/tables_page';
import { dbViewSignal } from '../table_builder/table_builder_state';

// Main Database Query Runner Component
export function DatabaseQueryRunner() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('results'); // 'results', 'history', 'favorites'

  useEffect(() => {
    // Simulate fetching available databases
    const fetchDatabases = async () => {
      try {
        // Mock data - replace with actual API call
        const mockDatabases = ['production', 'development', 'testing', 'analytics'];
        setDatabases(mockDatabases);
        setSelectedDb(mockDatabases[0]);
        
        // Load saved history and favorites from localStorage
        const savedHistory = localStorage.getItem('queryHistory');
        const savedFavorites = localStorage.getItem('queryFavorites');
        
        if (savedHistory) setQueryHistory(JSON.parse(savedHistory));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading databases:", error);
      }
    };
    
    fetchDatabases();
  }, []);

  const executeQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const startTime = performance.now();
      
      // Mock execution - replace with actual database call
      const response = await mockDatabaseCall(query, selectedDb);
      
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));
      
      setResults(response);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        query,
        database: selectedDb,
        timestamp: new Date().toISOString(),
        executionTime: (endTime - startTime).toFixed(2)
      };
      
      const updatedHistory = [newHistoryItem, ...queryHistory].slice(0, 50); // Keep only last 50 queries
      setQueryHistory(updatedHistory);
      localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      
      setActiveTab('results');
    } catch (err) {
      setError(err.message || 'An error occurred while executing the query');
    } finally {
      setLoading(false);
    }
  };
  
  // Mock database call function
  const mockDatabaseCall = async (queryText, database) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, return different mock results based on query content
    const lowerQuery = queryText.toLowerCase();
    
    if (lowerQuery.includes('error')) {
      throw new Error('SQL syntax error near "error"');
    }
    
    if (lowerQuery.includes('select') && lowerQuery.includes('from')) {
      // Sample SELECT query result
      const mockColumns = ['id', 'name', 'email', 'created_at'];
      const mockData = [];
      
      // Generate different data based on the database
      const baseNames = {
        'production': ['John', 'Emma', 'Michael', 'Sophia'],
        'development': ['Dev User', 'Test Admin', 'QA Tester'],
        'testing': ['Test A', 'Test B', 'Test C', 'Test D'],
        'analytics': ['Customer 1', 'Customer 2', 'Customer 3']
      };
      
      const names = baseNames[database] || baseNames.production;
      
      for (let i = 1; i <= 10; i++) {
        const name = names[i % names.length];
        mockData.push({
          id: i,
          name: `${name} ${i}`,
          email: `${name.toLowerCase().replace(' ', '')}${i}@example.com`,
          created_at: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
        });
      }
      
      return {
        columns: mockColumns,
        rows: mockData,
        rowCount: mockData.length,
        type: 'SELECT'
      };
    }
    
    if (lowerQuery.includes('insert') || lowerQuery.includes('update') || lowerQuery.includes('delete')) {
      // Sample modification query result
      return {
        affectedRows: Math.floor(Math.random() * 10) + 1,
        type: lowerQuery.includes('insert') ? 'INSERT' : lowerQuery.includes('update') ? 'UPDATE' : 'DELETE'
      };
    }
    
    // Default response for other queries
    return {
      message: 'Query executed successfully',
      type: 'UNKNOWN'
    };
  };

  const addToFavorites = () => {
    if (!query.trim()) return;
    
    const newFavorite = {
      id: Date.now(),
      query,
      database: selectedDb,
      name: `Query ${favorites.length + 1}`
    };
    
    const updatedFavorites = [newFavorite, ...favorites];
    setFavorites(updatedFavorites);
    localStorage.setItem('queryFavorites', JSON.stringify(updatedFavorites));
  };
  
  const loadQuery = (savedQuery) => {
    setQuery(savedQuery.query);
    if (savedQuery.database && databases.includes(savedQuery.database)) {
      setSelectedDb(savedQuery.database);
    }
  };
  
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('queryFavorites', JSON.stringify(updatedFavorites));
  };
  
  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem('queryHistory');
  };
  
  const downloadResults = () => {
    if (!results) return;
    
    let csvContent = '';
    
    if (results.type === 'SELECT' && results.columns && results.rows) {
      // Create CSV header
      csvContent = results.columns.join(',') + '\n';
      
      // Add rows
      results.rows.forEach(row => {
        const rowValues = results.columns.map(col => {
          const value = row[col] || '';
          // Escape commas and quotes
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        });
        csvContent += rowValues.join(',') + '\n';
      });
    } else {
      // For non-SELECT queries, just output the results as JSON
      csvContent = JSON.stringify(results, null, 2);
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQueryToClipboard = () => {
    navigator.clipboard.writeText(query).then(() => {
      // Could add a toast notification here
      console.log('Query copied to clipboard');
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
      <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab}/>
        <h1 className="text-xl font-semibold text-gray-800">Database Query Runner</h1>
      </div>

      <div className="flex flex-col flex-grow p-6 gap-4 scrollable-div">
        {/* Database Selector & Controls */}
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <label htmlFor="database" className="block text-sm font-medium text-gray-700 mb-1">
              Database
            </label>
            <div className="relative">
              <select
                id="database"
                value={selectedDb}
                onChange={(e) => setSelectedDb(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {databases.map(db => (
                  <option key={db} value={db}>{db}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="flex items-end gap-2 ml-auto">
            <button
              onClick={addToFavorites}
              className="px-3 py-2 inline-flex items-center gap-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              title="Save to favorites"
            >
              <Star size={16} className="text-gray-500" />
              <span>Save</span>
            </button>
            
            <button
              onClick={copyQueryToClipboard}
              className="px-3 py-2 inline-flex items-center gap-1 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              title="Copy query"
            >
              <Copy size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Query Editor */}
        <div className="flex flex-col flex-grow">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
            SQL Query
          </label>
          <div className="flex-grow flex flex-col relative">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              className="flex-grow p-4 text-sm font-mono border border-gray-300 rounded-t-md focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  executeQuery();
                }
              }}
            />
            <div className="bg-gray-50 px-4 py-2 border-t-0 border border-gray-300 rounded-b-md flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Press Ctrl+Enter to execute
              </div>
              <button
                onClick={executeQuery}
                disabled={loading || !query.trim()}
                className={`px-4 py-2 flex items-center gap-2 text-sm rounded-md ${
                  loading || !query.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Executing...' : (
                  <>
                    <Play size={16} />
                    <span>Execute</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex flex-col flex-grow border border-gray-300 rounded-md bg-white">
          {/* Tabs */}
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'results' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <History size={14} />
              <span>History</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
                activeTab === 'favorites' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Star size={14} />
              <span>Favorites</span>
            </button>
            
            {executionTime && activeTab === 'results' && (
              <div className="ml-auto flex items-center px-4 text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>{executionTime} ms</span>
                
                {results && (
                  <button 
                    onClick={downloadResults}
                    className="ml-4 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    title="Download results"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-grow p-4 overflow-auto">
            {activeTab === 'results' && (
              <ResultsPanel 
                results={results} 
                loading={loading} 
                error={error} 
              />
            )}
            
            {activeTab === 'history' && (
              <HistoryPanel 
                history={queryHistory} 
                onSelectQuery={loadQuery}
                onClearHistory={clearHistory}
              />
            )}
            
            {activeTab === 'favorites' && (
              <FavoritesPanel 
                favorites={favorites} 
                onSelectQuery={loadQuery}
                onRemoveFavorite={removeFavorite}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Results Display Component
function ResultsPanel({ results, loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Executing query...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
        <div className="font-medium">Error</div>
        <div className="mt-1">{error}</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>Execute a query to see results</p>
      </div>
    );
  }

  // Handle SELECT query results
  if (results.type === 'SELECT' && results.columns && results.rows) {
    return (
      <div>
        <div className="mb-2 text-sm text-gray-500">
          {results.rowCount} {results.rowCount === 1 ? 'row' : 'rows'} returned
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {results.columns.map((column, index) => (
                  <th 
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {results.columns.map((column, colIndex) => (
                    <td 
                      key={`${rowIndex}-${colIndex}`}
                      className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 font-mono"
                    >
                      {row[column] !== null && row[column] !== undefined ? String(row[column]) : 
                        <span className="text-gray-400">NULL</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Handle modification query results (INSERT, UPDATE, DELETE)
  if (['INSERT', 'UPDATE', 'DELETE'].includes(results.type)) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
        <div className="font-medium">Success</div>
        <div className="mt-1">
          {results.affectedRows} {results.affectedRows === 1 ? 'row' : 'rows'} affected
        </div>
      </div>
    );
  }

  // Handle other query results
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
      <div className="font-medium">Query executed successfully</div>
      {results.message && <div className="mt-1">{results.message}</div>}
    </div>
  );
}

// History Display Component
function HistoryPanel({ history, onSelectQuery, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>No query history</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Query History</h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash size={14} />
          <span>Clear History</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {history.map((item) => (
          <div 
            key={item.id}
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectQuery(item)}
          >
            <div className="font-mono text-sm truncate mb-1">{item.query}</div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="font-medium text-gray-700 mr-2">{item.database}</span>
              <Clock size={12} className="mr-1" />
              <span>{item.executionTime} ms</span>
              <span className="mx-2">•</span>
              <span>{new Date(item.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Favorites Display Component
function FavoritesPanel({ favorites, onSelectQuery, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>No saved queries</p>
        <p className="text-sm mt-2">Click the Save button to add queries to favorites</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Queries</h3>
      
      <div className="space-y-2">
        {favorites.map((item) => (
          <div 
            key={item.id}
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center"
          >
            <div 
              className="flex-grow cursor-pointer"
              onClick={() => onSelectQuery(item)}
            >
              <div className="font-medium mb-1">{item.name}</div>
              <div className="font-mono text-sm text-gray-700 truncate">{item.query}</div>
              <div className="text-xs text-gray-500 mt-1">
                Database: {item.database}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(item.id);
              }}
              className="ml-2 p-1 text-gray-400 hover:text-red-600"
              title="Remove from favorites"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}