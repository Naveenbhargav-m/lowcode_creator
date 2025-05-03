import { useState, useEffect } from 'react';
import { X, Plus, Code, ListOrdered, Play, Save } from 'lucide-react';

// Central styling object
const styles = {
  container: "w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100",
  header: "mb-6",
  title: "text-xl font-semibold text-gray-800 mb-2",
  description: "text-sm text-gray-500",
  tabContainer: "mb-6",
  tabs: "flex bg-gray-50 p-1 rounded-lg",
  tab: "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200",
  activeTab: "bg-white text-blue-600 shadow-sm rounded-md",
  inactiveTab: "text-gray-600 hover:text-gray-900",
  codeEditorContainer: "rounded-lg border border-gray-200 overflow-hidden",
  codeEditor: "w-full h-72 p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none resize-none",
  fieldsContainer: "space-y-3 p-1",
  fieldItem: "flex items-center gap-2 animate-fadeIn",
  fieldInput: "flex-1 p-3 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  buttonBar: "flex justify-between mt-4",
  button: "rounded-lg transition-all duration-200",
  iconButton: "p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700",
  primaryButton: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 font-medium flex items-center gap-2",
  secondaryButton: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 font-medium flex items-center gap-2",
  dangerButton: "bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600",
  removeButton: "p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200",
  errorMessage: "mt-3 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-md",
  successMessage: "mt-3 px-4 py-2 bg-green-50 text-green-600 text-sm rounded-md",
  emptyState: "flex flex-col items-center justify-center py-10 text-gray-500"
};

export function JSEditorWithInputFields({ 
  initialCode = "", 
  initialFields = [], 
  isInput,
  onParamsChange, 
}) {
    console.log("code view inputs:", initialCode, initialFields, isInput);

  let titles = ["input transform code", "input fields"];
  let outputtitles = ["output transform code", "output fields"];
  const [activeTab, setActiveTab] = useState("code");
  const [code, setCode] = useState(initialCode);
  const [fields, setFields] = useState(initialFields);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect((() => {
    let tempCode = initialCode || "";
    let tempFields = initialFields || [];
    setCode(tempCode);
    setFields(tempFields);
    console.log("init data is done", tempCode, tempFields);
  }), [initialCode,initialFields]);
  // Handle code change
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    setError("");
    onParamsChange({ "code": newCode, "fields": fields} );
  };
  
  // Handle field change
  const handleFieldChange = (index, value) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
    onParamsChange({ "code": code, "fields": newFields });
  };
  
  // Add new field
  const addField = () => {
    const newFields = [...fields, `Input ${fields.length + 1}`];
    setFields(newFields);
    onParamsChange({ code, fields: newFields });
  };
  
  // Remove field
  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onParamsChange({ code, fields: newFields });
  };
  
  // Execute code (safely)
  const executeCode = () => {
    setSuccess("");
    try {
      // Create a safe evaluation environment
      const safeEval = new Function('fields', `
        try {
          ${code}
          return { success: true };
        } catch(e) {
          return { success: false, error: e.message };
        }
      `);
      
      const result = safeEval(fields);
      
      if (!result.success) {
        setError(`Execution error: ${result.error}`);
      } else {
        setError("");
        setSuccess("Code executed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (e) {
      setError(`Syntax error: ${e.message}`);
    }
  };
  
  // Save changes
  const saveChanges = () => {
    onParamsChange({ code, fields });
    setSuccess("Changes saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };
  
  return (
    <div className={styles.container}>
      
      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "code" ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => setActiveTab("code")}
          >
            <Code size={16} /> {isInput ? titles[0] : outputtitles[0]}
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "fields" ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => setActiveTab("fields")}
          >
            <ListOrdered size={16} />  {isInput ? titles[1] : outputtitles[1]} ({fields.length})
          </button>
        </div>
      </div>
      
      {/* Code Editor Tab */}
      {activeTab === "code" && (
        <div>
          <div className={styles.codeEditorContainer}>
            <textarea
              value={code}
              onChange={handleCodeChange}
              className={styles.codeEditor}
              spellCheck={false}
            />
          </div>
          <div className={styles.buttonBar}>
            <div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={saveChanges}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                <Save size={16} /> Save
              </button>
              <button 
                onClick={executeCode}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                <Play size={16} /> Run Code
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Input Fields Tab */}
      {activeTab === "fields" && (
        <div>
          <div className={styles.fieldsContainer}>
            {fields.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No input fields added yet</p>
                <button 
                  onClick={addField}
                  className={`${styles.button} ${styles.secondaryButton} mt-3`}
                >
                  <Plus size={16} /> Add Your First Field
                </button>
              </div>
            ) : (
              fields.map((field, index) => (
                <div key={index} className={styles.fieldItem}>
                  <input
                    type="text"
                    value={field}
                    onChange={(e) => handleFieldChange(index, e.target.value)}
                    className={styles.fieldInput}
                    placeholder="Enter input value"
                  />
                  <button 
                    onClick={() => removeField(index)}
                    className={styles.removeButton}
                    aria-label="Remove field"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {fields.length > 0 && (
            <div className={styles.buttonBar}>
              <div>
                {success && <p className={styles.successMessage}>{success}</p>}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={addField}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  <Plus size={16} /> Add Field
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}