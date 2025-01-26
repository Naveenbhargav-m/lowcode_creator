
function setConfigLocal(key, config) {
    try {
      const configString = JSON.stringify(config);  // Convert config object to a string
      localStorage.setItem(key, configString);      // Save to localStorage
      console.log(`Config set for key: ${key}`);
    } catch (error) {
      console.error("Failed to set config:", error);
    }
  }

  
  function getConfigLocal(key) {
    try {
      const configString = localStorage.getItem(key);  // Retrieve config string from localStorage
      return configString ? JSON.parse(configString) : null;  // Parse string to an object or return null if not found
    } catch (error) {
      console.error("Failed to get config:", error);
      return null;
    }
  }

export {setConfigLocal , getConfigLocal};