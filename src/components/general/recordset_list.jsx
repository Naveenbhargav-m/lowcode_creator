import React, { useState, cloneElement } from 'react';
import { Trash } from 'lucide-react';

const RecordsetList = ({ 
  children, 
  initialRecords = [], 
  onRecordsChange = () => {},
  addButtonText = "Add Record" 
}) => {
  // State to manage the list of records
  const [records, setRecords] = useState(initialRecords.length > 0 
    ? initialRecords 
    : [{ id: Date.now(), data: {} }]
  );

  // Add a new empty record
  const addRecord = () => {
    const newRecords = [...records, { id: Date.now(), data: {} }];
    setRecords(newRecords);
    onRecordsChange(newRecords);
  };

  // Remove a record by id
  const removeRecord = (id) => {
    const newRecords = records.filter(record => record.id !== id);
    setRecords(newRecords);
    onRecordsChange(newRecords);
  };

  // Update record data
  const updateRecord = (id, data) => {
    const newRecords = records.map(record => 
      record.id === id ? { ...record, data } : record
    );
    setRecords(newRecords);
    onRecordsChange(newRecords);
  };

  return (
    <div className="w-full mx-auto">
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="flex items-start gap-2" style={{"display": "flex", "flexDirection": "row", "alignItems":"center"}}>
            <div className="flex-1">
              {children && cloneElement(children, {
                data: record.data,
                onChange: (newData) => updateRecord(record.id, newData),
                recordId: record.id
              })}
            </div>
            <button
              onClick={() => removeRecord(record.id)}
              className="p-2 bg-white text-red-500 hover:text-red-700 hover:bg-white flex-shrink-0 mt-1"
              aria-label="Remove record"

            >
              <div>
              <Trash size={18} />
              </div>
            </button>
          </div>
        ))}
      </div>
      
      <button
        onClick={addRecord}
        className="mt-4 px-4 py-2"
        style={{"fontSize":"0.8em" , "backgroundColor":"black"}}
      >
        {addButtonText}
      </button>
    </div>
  );
};

// Example usage with a custom row component
const PersonForm = ({ data, onChange, recordId }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  
  return (
    <input style={{"backgroundColor":"white", "color":"black"}}></input>
  );
};

const TestRV = () => {
  const [records, setRecords] = useState([]);
  
  // Handle records change
  const handleRecordsChange = (newRecords) => {
    setRecords(newRecords);
    console.log('Records updated:', newRecords);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Contact List</h1>
      <RecordsetList 
        initialRecords={[{ id: 1, data: { firstName: 'John', lastName: 'Doe' } }]}
        onRecordsChange={handleRecordsChange}
        addButtonText="Add Contact"
      >
        <PersonForm />
      </RecordsetList>
    </div>
  );
};

export default TestRV;