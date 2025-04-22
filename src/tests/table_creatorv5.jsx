// Main App Component
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Database } from 'lucide-react';

import { Plus, X, Save, Trash2, Table as TableIcon } from 'lucide-react';
import { generateUID } from '../utils/helpers';

let fieldStyle = {"color": "black"};
export default function TableBuilderV5() {
    const [tables, setTables] = useState([
        {
          id: 1,
          "fid": "23456",
          name: 'users',
          fields: [
            { id: 1,"fid": "1234", name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null },
            { id: 2, "fid": "1233",name:  'username', type: 'VARCHAR', length: 100, nullable: false, defaultValue: null },
            { id: 3, "fid": "4321",name: 'email', type: 'VARCHAR', length: 255, nullable: false, defaultValue: null },
            { id: 4, "fid": "5452",name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()' },
          ]
        },
        {
          id: 2,
          "fid": "8585", 
          name: 'posts',
          fields: [
            { id: 1, "fid": "4324", name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null },
            { id: 2,"fid": "5425", name: 'title', type: 'VARCHAR', length: 200, nullable: false, defaultValue: null },
            { id: 3,"fid": "6535", name: 'content', type: 'TEXT', nullable: true, defaultValue: null },
            { id: 4,"fid": "5679", name: 'user_id', type: 'INTEGER', nullable: false, defaultValue: null },
            { id: 5,"fid": "8654", name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()' },
          ]
        }
      ]);
      
      const [relations, setRelations] = useState([
        { id: 1, "fid": "4322", fromTable: 'posts', fromField: 'user_id', toTable: 'users', toField: 'id' }
      ]);
      
      const [activeTable, setActiveTable] = useState(null);
      const [showSql, setShowSql] = useState(false);
      const [jsonOutput, setJsonOutput] = useState('');
      
      // Store original state for comparison when generating transactions
      const [originalTables, setOriginalTables] = useState([]);
      const [originalRelations, setOriginalRelations] = useState([]);
      
      // Track modified items
      const [modifiedItems, setModifiedItems] = useState({
        tables: new Set(), // table ids
        fields: new Set(), // "tableId_fieldId" strings
        relations: new Set() // relation ids
      });
      
      // Initialize original state from initial tables/relations
      useEffect(() => {
        if (originalTables.length === 0 && tables.length > 0) {
          setOriginalTables(JSON.parse(JSON.stringify(tables)));
        }
        if (originalRelations.length === 0 && relations.length > 0) {
          setOriginalRelations(JSON.parse(JSON.stringify(relations)));
        }
      }, [tables, relations]);
      
      // Set the first table as active by default
      useEffect(() => {
        if (tables.length > 0 && activeTable === null) {
          setActiveTable(tables[0].fid);
        }
      }, [tables, activeTable]);
      
      // Find active table
      const currentTable = tables.find(t => t.fid === activeTable);
      
      // Helper function to mark items as modified
      const markAsModified = (type, id) => {
        setModifiedItems(prev => {
          const newState = {...prev};
          newState[type].add(id);
          return newState;
        });
      };
      
      // Create a new table
      const handleCreateTable = (tableName) => {
        if (!tableName.trim()) return;
        
        const newId = Math.max(0, ...tables.map(t => t.id)) + 1;
        let myid = generateUID();
        const newTable = {
          id: newId,
          fid: myid,
          name: tableName.trim().toLowerCase(),
          fields: [
            { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null }
          ]
        };
        
        // New tables are automatically considered modified
        markAsModified('tables', myid);
        
        setTables([...tables, newTable]);
        setActiveTable(newId);
        return newTable;
      };
      
      // Delete a table
      const handleDeleteTable = (tableId) => {
        // Mark as modified before deleting
        markAsModified('tables', tableId);
        
        const tableToDelete = tables.find(t => t.fid === tableId);
        
        // Delete relations involving this table
        if (tableToDelete) {
          const relationsToModify = relations.filter(r => 
            r.fromTable === tableToDelete.name || r.toTable === tableToDelete.name
          );
          
          relationsToModify.forEach(relation => {
            markAsModified('relations', relation.fid);
          });
          
          setRelations(relations.filter(r => 
            r.fromTable !== tableToDelete.name && r.toTable !== tableToDelete.name
          ));
        }
        
        setTables(tables.filter(t => t.fid !== tableId));
        
        // Set active table to another one if the active one is deleted
        if (activeTable === tableId) {
          const remainingTables = tables.filter(t => t.fid !== tableId);
          setActiveTable(remainingTables.length > 0 ? remainingTables[0].fid : null);
        }
      };
      
      // Add a new field to a table
      const handleAddField = (tableId) => {
        const table = tables.find(t => t.fid === tableId);
        if (!table) return;
        
        markAsModified('tables', tableId);
        
        const newFieldId = Math.max(0, ...table.fields.map(f => f.id)) + 1;
        let myid = generateUID();
        setTables(tables.map(table => {
          if (table.fid === tableId) {
            return {
              ...table,
              fields: [
                ...table.fields,
                { id: newFieldId, fid: myid, name: 'new_field', type: 'VARCHAR', length: 255, nullable: true, defaultValue: null }
              ]
            };
          }
          return table;
        }));
      };
      
      // Delete a field
      const handleDeleteField = (tableId, fieldId) => {
        markAsModified('tables', tableId);
        markAsModified('fields', `${tableId}_${fieldId}`);
        
        setTables(tables.map(table => {
          if (table.fid === tableId) {
            return {
              ...table,
              fields: table.fields.filter(field => field.fid !== fieldId)
            };
          }
          return table;
        }));
      };
      
      // Update field properties
      const handleUpdateField = (tableId, fieldId, property, value) => {
        markAsModified('tables', tableId);
        markAsModified('fields', `${tableId}_${fieldId}`);
        
        setTables(tables.map(table => {
          if (table.fid === tableId) {
            return {
              ...table,
              fields: table.fields.map(field => {
                if (field.fid === fieldId) {
                  return { ...field, [property]: value };
                }
                return field;
              })
            };
          }
          return table;
        }));
      };
      
      // Add a new relation
      const handleAddRelation = (fromTable, fromField, toTable, toField) => {
        const newId = Math.max(0, ...relations.map(r => r.id)) + 1;
        let myid = generateUID();
        const newRelation = {
          id: newId,
          fid: myid,
          fromTable,
          fromField,
          toTable,
          toField
        };
        
        markAsModified('relations', newId);
        
        setRelations([...relations, newRelation]);
        return newRelation;
      };
      
      // Delete a relation
      const handleDeleteRelation = (relationId) => {
        markAsModified('relations', relationId);
        
        setRelations(relations.filter(r => r.fid !== relationId));
      };
// Generate transactions for the current state by comparing with original state
const generateTransactions = () => {
    let transactions = [];
    
    // Create maps for faster lookups
    const originalTablesById = {};
    const originalTablesByName = {};
    originalTables.forEach(table => {
      originalTablesById[table.fid] = table;
      originalTablesByName[table.name] = table;
    });
    
    const currentTablesById = {};
    const currentTablesByName = {};
    tables.forEach(table => {
      currentTablesById[table.fid] = table;
      currentTablesByName[table.name] = table;
    });
    
    // 1. Handle table renames first (using IDs to track across name changes)
    // Store renames for later application to avoid conflicts with circular renames
    const tableRenames = [];
    for (const tableId in originalTablesById) {
      const originalTable = originalTablesById[tableId];
      const currentTable = currentTablesById[tableId];
      
      // If table still exists but name changed
      if (currentTable && originalTable.name !== currentTable.name) {
        tableRenames.push({
          tableId,
          oldName: originalTable.name,
          newName: currentTable.name
        });
      }
    }
    
    // Sort table renames to handle dependencies
    // This is a simplified topological sort to handle rename chains
    const processedTableRenames = new Set();
    const tableRenameTransactions = [];
    
    while (tableRenames.length > 0) {
      let progress = false;
      
      for (let i = 0; i < tableRenames.length; i++) {
        const rename = tableRenames[i];
        
        // Check if this rename's new name conflicts with any unprocessed rename's old name
        const hasConflict = tableRenames.some(otherRename => 
          otherRename !== rename && 
          !processedTableRenames.has(otherRename) && 
          otherRename.oldName === rename.newName
        );
        
        if (!hasConflict) {
          // No conflict, can process this rename
          tableRenameTransactions.push({
            id: `rename_table_${rename.tableId}`,
            type: 'rename_table',
            oldName: rename.oldName,
            newName: rename.newName
          });
          
          // Update tracking maps
          const originalTable = originalTablesById[rename.tableId];
          delete originalTablesByName[originalTable.name];
          originalTablesByName[rename.newName] = originalTable;
          originalTable.name = rename.newName;
          
          processedTableRenames.add(rename);
          tableRenames.splice(i, 1);
          progress = true;
          break;
        }
      }
      
      if (!progress && tableRenames.length > 0) {
        // We have a circular dependency - break it by using a temporary name
        const rename = tableRenames[0];
        const tempName = `_temp_${rename.oldName}_${Date.now()}`;
        
        tableRenameTransactions.push({
          id: `rename_table_temp_${rename.tableId}`,
          type: 'rename_table',
          oldName: rename.oldName,
          newName: tempName
        });
        
        tableRenameTransactions.push({
          id: `rename_table_final_${rename.tableId}`,
          type: 'rename_table',
          oldName: tempName,
          newName: rename.newName
        });
        
        // Update tracking maps
        const originalTable = originalTablesById[rename.tableId];
        delete originalTablesByName[originalTable.name];
        originalTablesByName[rename.newName] = originalTable;
        originalTable.name = rename.newName;
        
        processedTableRenames.add(rename);
        tableRenames.splice(0, 1);
      }
    }
    
    // Add all table rename transactions
    transactions.push(...tableRenameTransactions);
    
    // 2. Handle dropped tables - tables that exist in original but not in current (by ID)
    for (const tableId in originalTablesById) {
      if (!currentTablesById[tableId]) {
        const table = originalTablesById[tableId];
        transactions.push({
          id: `drop_table_${tableId}`,
          type: 'drop_table',
          table: table.name
        });
      }
    }
    
    // 3. Handle new tables - tables that exist in current but not in original (by ID)
    for (const tableId in currentTablesById) {
      if (!originalTablesById[tableId]) {
        const table = currentTablesById[tableId];
        transactions.push({
          id: `create_table_${tableId}`,
          type: 'create_table',
          table: table.name,
          fields: table.fields.map(field => ({
            name: field.name,
            dataType: field.type,
            length: field.length || null,
            primaryKey: !!field.primaryKey,
            nullable: !!field.nullable,
            defaultValue: field.defaultValue || null
          }))
        });
      }
    }
    
    // 4. Handle field changes for each table that exists in both states
    for (const tableId in currentTablesById) {
      if (!originalTablesById[tableId]) continue; // Skip new tables (already handled)
      
      const originalTable = originalTablesById[tableId];
      const currentTable = currentTablesById[tableId];
      const tableName = currentTable.name; // Use current name (after potential rename)
      
      // Create maps of fields by ID and name for easier comparison
      const originalFieldsById = {};
      const originalFieldsByName = {};
      originalTable.fields.forEach(field => {
        originalFieldsById[field.fid] = field;
        originalFieldsByName[field.name] = field;
      });
      
      const currentFieldsById = {};
      const currentFieldsByName = {};
      currentTable.fields.forEach(field => {
        currentFieldsById[field.fid] = field;
        currentFieldsByName[field.name] = field;
      });
      
      // 4.1. Handle field renames first (using IDs to track across name changes)
      // Store renames for later application to avoid conflicts with circular renames
      const fieldRenames = [];
      for (const fieldId in originalFieldsById) {
        const originalField = originalFieldsById[fieldId];
        const currentField = currentFieldsById[fieldId];
        
        // If field still exists but name changed
        if (currentField && originalField.name !== currentField.name) {
          fieldRenames.push({
            tableId,
            fieldId,
            oldName: originalField.name,
            newName: currentField.name
          });
        }
      }
      const processedRenames = new Set();
      const fieldRenameTransactions = [];
      
      while (fieldRenames.length > 0) {
        let progress = false;
        
        for (let i = 0; i < fieldRenames.length; i++) {
          const rename = fieldRenames[i];
          
          // Check if this rename's new name conflicts with any unprocessed rename's old name
          const hasConflict = fieldRenames.some(otherRename => 
            otherRename !== rename && 
            !processedRenames.has(otherRename) && 
            otherRename.oldName === rename.newName
          );
          if (!hasConflict) {
            // No conflict, can process this rename
            fieldRenameTransactions.push({
              id: `rename_field_${rename.tableId}_${rename.fieldId}`,
              type: 'rename_field',
              table: tableName,
              oldName: rename.oldName,
              newName: rename.newName
            });
            
            // Update tracking maps
            // const originalField = originalFieldsById[rename.fieldId];
            // delete originalFieldsByName[originalField.name];
            // originalFieldsByName[rename.newName] = originalField;
            // originalField.name = rename.newName;
            
            processedRenames.add(rename);
            fieldRenames.splice(i, 1);
            progress = true;
            break;
          }
        }
        
        if (!progress && fieldRenames.length > 0) {
          // We have a circular dependency - break it by using a temporary name
          const rename = fieldRenames[0];
          const tempName = `_temp_${rename.oldName}_${Date.now()}`;
          
          fieldRenameTransactions.push({
            id: `rename_field_temp_${rename.tableId}_${rename.fieldId}`,
            type: 'rename_field',
            table: tableName,
            oldName: rename.oldName,
            newName: tempName
          });
          
          fieldRenameTransactions.push({
            id: `rename_field_final_${rename.tableId}_${rename.fieldId}`,
            type: 'rename_field',
            table: tableName,
            oldName: tempName,
            newName: rename.newName
          });
          
          // Update tracking maps
          const originalField = originalFieldsById[rename.fieldId];
          delete originalFieldsByName[originalField.name];
          originalFieldsByName[rename.newName] = originalField;
          originalField.name = rename.newName;
          
          processedRenames.add(rename);
          fieldRenames.splice(0, 1);
        }
      }
      
      // Add all field rename transactions
      transactions.push(...fieldRenameTransactions);
      
      // 4.2. Handle fields with same name but different IDs (one deleted, one created with same name)
      const processedSameNameFields = new Set();
      
      for (const fieldName in originalFieldsByName) {
        if (currentFieldsByName[fieldName] && !processedSameNameFields.has(fieldName)) {
          const originalField = originalFieldsByName[fieldName];
          const currentField = currentFieldsByName[fieldName];
          
          // If they have different IDs, it means one was deleted and another created with the same name
          if (originalField.fid !== currentField.fid) {
            transactions.push({
              id: `drop_field_samename_${tableId}_${originalField.fid}`,
              type: 'drop_field',
              table: tableName,
              field: fieldName
            });
            
            transactions.push({
              id: `add_field_samename_${tableId}_${currentField.fid}`,
              type: 'add_field',
              table: tableName,
              field: {
                name: fieldName,
                dataType: currentField.type,
                length: currentField.length || null,
                primaryKey: !!currentField.primaryKey,
                nullable: !!currentField.nullable,
                defaultValue: currentField.defaultValue || null
              }
            });
            
            // Mark as processed to avoid double handling
            processedSameNameFields.add(fieldName);
            delete originalFieldsByName[fieldName];
            delete currentFieldsByName[fieldName];
          }
        }
      }
      
      // 4.3. Handle dropped fields
      for (const fieldId in originalFieldsById) {
        if (!currentFieldsById[fieldId]) {
          const field = originalFieldsById[fieldId];
          // Skip fields that were handled in the "same name different ID" case
          if (!processedSameNameFields.has(field.name)) {
            transactions.push({
              id: `drop_field_${tableId}_${fieldId}`,
              type: 'drop_field',
              table: tableName,
              field: field.name
            });
          }
        }
      }
      
      // 4.4. Handle new fields
      for (const fieldId in currentFieldsById) {
        if (!originalFieldsById[fieldId]) {
          const field = currentFieldsById[fieldId];
          // Skip fields that were handled in the "same name different ID" case
          if (!processedSameNameFields.has(field.name)) {
            transactions.push({
              id: `add_field_${tableId}_${fieldId}`,
              type: 'add_field',
              table: tableName,
              field: {
                name: field.name,
                dataType: field.type,
                length: field.length || null,
                primaryKey: !!field.primaryKey,
                nullable: !!field.nullable,
                defaultValue: field.defaultValue || null
              }
            });
          }
        }
      }
      
      // 4.5. Handle modified fields
      for (const fieldId in currentFieldsById) {
        if (!originalFieldsById[fieldId]) continue; // Skip new fields (already handled)
        
        const originalField = originalFieldsById[fieldId];
        const currentField = currentFieldsById[fieldId];
        // Skip if only the name changed (already handled in renames)
        if (originalField.name !== currentField.name && 
            !hasFieldPropertiesChanged(originalField, currentField)) {
          continue;
        }
        
        // Check for modifications to field properties
        const modifications = getFieldModifications(originalField, currentField);
        // Handle primary key changes separately
        if ('primaryKey' in modifications) {
          const pkTransaction = handlePrimaryKeyChange(tableId, originalField, currentField, tableName);
          if (pkTransaction) {
            transactions.push(pkTransaction);
            delete modifications.primaryKey; // Remove from regular modifications
          }
        }
        
        // Only create a transaction if there are modifications
        if (Object.keys(modifications).length > 0) {
          transactions.push({
            id: `alter_field_${tableId}_${fieldId}`,
            type: 'alter_field',
            table: tableName,
            field: currentField.name, // Use current name after potential rename
            modifications
          });
        }
      }
    }
    
    // 5. Handle relations
    // Create maps of relations by ID for easier comparison
    const originalRelationsById = {};
    originalRelations.forEach(relation => {
      originalRelationsById[relation.fid] = relation;
    });
    
    const currentRelationsById = {};
    relations.forEach(relation => {
      currentRelationsById[relation.fid] = relation;
    });
    
    // Create a composite key map to detect "same relation, different ID" cases
    const originalRelationsByKey = {};
    originalRelations.forEach(relation => {
      const key = `${relation.fromTable}.${relation.fromField}->${relation.toTable}.${relation.toField}`;
      originalRelationsByKey[key] = relation;
    });
    
    const currentRelationsByKey = {};
    relations.forEach(relation => {
      const key = `${relation.fromTable}.${relation.fromField}->${relation.toTable}.${relation.toField}`;
      currentRelationsByKey[key] = relation;
    });
    
    // Track processed relations to avoid duplicates
    const processedRelations = new Set();
    
    // 5.1. Handle relations with same definition but different IDs
    for (const key in originalRelationsByKey) {
      if (currentRelationsByKey[key] && 
          originalRelationsByKey[key].fid !== currentRelationsByKey[key].fid) {
        
        // No need to drop and recreate if they're functionally identical
        processedRelations.add(originalRelationsByKey[key].fid);
        processedRelations.add(currentRelationsByKey[key].fid);
      }
    }
    
    // 5.2. Handle dropped relations
    for (const relationId in originalRelationsById) {
      if (!currentRelationsById[relationId] && !processedRelations.has(relationId)) {
        const relation = originalRelationsById[relationId];
        transactions.push({
          id: `drop_relation_${relationId}`,
          type: 'drop_foreign_key',
          constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
          sourceTable: relation.fromTable
        });
        
        processedRelations.add(relationId);
      }
    }
    
    // 5.3. Handle new relations
    for (const relationId in currentRelationsById) {
      if (!originalRelationsById[relationId] && !processedRelations.has(relationId)) {
        const relation = currentRelationsById[relationId];
        
        // Check if this relation is functionally identical to a renamed table's relation
        let isDuplicateOfRenamed = false;
        
        for (const origRelId in originalRelationsById) {
          const origRel = originalRelationsById[origRelId];
          // If tables were renamed, the relation might appear as new but is actually just affected by the rename
          if (origRel.fromField === relation.fromField && 
              origRel.toField === relation.toField) {
            // Use a simple check - if both tables exist in both states with different names
            if (tableRenameTransactions.some(t => 
                (t.oldName === origRel.fromTable && t.newName === relation.fromTable) ||
                (t.oldName === origRel.toTable && t.newName === relation.toTable))) {
              isDuplicateOfRenamed = true;
              break;
            }
          }
        }
        
        if (!isDuplicateOfRenamed) {
          transactions.push({
            id: `create_relation_${relationId}`,
            type: 'create_foreign_key',
            constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
            sourceTable: relation.fromTable,
            sourceColumn: relation.fromField,
            targetTable: relation.toTable,
            targetColumn: relation.toField
          });
        }
        
        processedRelations.add(relationId);
      }
    }
    
    // 5.4. Handle modified relations
    for (const relationId in currentRelationsById) {
      if (!originalRelationsById[relationId] || processedRelations.has(relationId)) continue;
      
      const originalRelation = originalRelationsById[relationId];
      const currentRelation = currentRelationsById[relationId];
      
      // Check if relation changed
      if (hasRelationChanged(originalRelation, currentRelation)) {
        // Drop and recreate the relation
        transactions.push({
          id: `drop_relation_old_${relationId}`,
          type: 'drop_foreign_key',
          constraintName: `fk_${originalRelation.fromTable}_${originalRelation.toTable}`,
          sourceTable: originalRelation.fromTable
        });
        
        transactions.push({
          id: `create_relation_new_${relationId}`,
          type: 'create_foreign_key',
          constraintName: `fk_${currentRelation.fromTable}_${currentRelation.toTable}`,
          sourceTable: currentRelation.fromTable,
          sourceColumn: currentRelation.fromField,
          targetTable: currentRelation.toTable,
          targetColumn: currentRelation.toField
        });
        
        processedRelations.add(relationId);
      }
    }
    
    // 6. Sort transactions to ensure proper execution order
    // The order should be: drops first, then creates/alters, then constraints
    const transactionOrder = {
      'drop_foreign_key': 1,
      'drop_field': 2,
      'drop_table': 3,
      'rename_table': 4,
      'create_table': 5,
      'rename_field': 6,
      'add_field': 7,
      'alter_field': 8,
      'set_primary_key': 9,
      'drop_primary_key': 10,
      'create_foreign_key': 11
    };
    
    transactions.sort((a, b) => {
      return (transactionOrder[a.type] || 99) - (transactionOrder[b.type] || 99);
    });
    
    return transactions;
  };
  
  // Helper function to check if a field's properties have changed
  function hasFieldPropertiesChanged(originalField, currentField) {
    // Check case-sensitivity if names differ only by case
    const isCaseSensitive = true; // Set based on your database
    
    if (isCaseSensitive && originalField.name.toLowerCase() === currentField.name.toLowerCase() && 
        originalField.name !== currentField.name) {
      return true; // Name differs only in case, which is a change in case-sensitive DBs
    }
    
    const props = ['type', 'length', 'primaryKey', 'nullable', 'defaultValue'];
    
    for (const prop of props) {
      const originalValue = normalizeValue(originalField[prop]);
      const currentValue = normalizeValue(currentField[prop]);
      
      if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Helper function to get field modifications
  function getFieldModifications(originalField, currentField) {
    const modifications = {};
    const propMapping = {
      'type': 'dataType',
      'length': 'length',
      'primaryKey': 'primaryKey',
      'nullable': 'nullable',
      'defaultValue': 'defaultValue'
    };
    
    for (const [prop, transactionProp] of Object.entries(propMapping)) {
      const originalValue = normalizeValue(originalField[prop]);
      const currentValue = normalizeValue(currentField[prop]);
      
      if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
        modifications[transactionProp] = currentValue;
      }
    }
    
    return modifications;
  }
  
  // Helper function to normalize field values for comparison
  function normalizeValue(value) {
    if (typeof value === 'boolean' || value === true || value === false) {
      return !!value;
    }
    if (value === undefined || value === '') {
      return null;
    }
    
    // Special handling for certain default values
    if (typeof value === 'string') {
      // Case-insensitive comparison for function-based defaults
      const normalized = value.trim().toUpperCase();
      if (normalized === 'NOW()' || normalized === 'CURRENT_TIMESTAMP') {
        return 'CURRENT_TIMESTAMP'; // Standardize timestamp functions
      }
    }
    
    return value;
  }
  
  // Helper function to check if a relation has changed
  function hasRelationChanged(originalRelation, currentRelation) {
    return originalRelation.fromTable !== currentRelation.fromTable ||
           originalRelation.fromField !== currentRelation.fromField ||
           originalRelation.toTable !== currentRelation.toTable ||
           originalRelation.toField !== currentRelation.toField;
  }
  
  // Helper function to handle primary key changes
  function handlePrimaryKeyChange(tableId, originalField, currentField, tableName) {
    if (originalField.primaryKey !== currentField.primaryKey) {
      // If changing from non-primary to primary key
      if (currentField.primaryKey) {
        return {
          id: `set_primary_key_${tableId}_${currentField.fid}`,
          type: 'set_primary_key',
          table: tableName,
          field: currentField.name
        };
      } 
      // If removing primary key
      else {
        return {
          id: `drop_primary_key_${tableId}`,
          type: 'drop_primary_key',
          table: tableName
        };
      }
    }
    return null;
  }
  // Generate SQL output 
  const handleGenerateJson = () => {
    // Generate the configuration JSON (for reloading the state)
    const configJson = {
      tables: tables.map(table => ({
        id: table.id,
        fid: table.fid,
        name: table.name,
        fields: table.fields.map(field => ({
          fid: field.fid,
          id: field.id,
          name: field.name,
          type: field.type,
          length: field.length || null,
          primaryKey: !!field.primaryKey,
          nullable: !!field.nullable,
          defaultValue: field.defaultValue || null
        }))
      })),
      relations: relations.map(relation => ({
        id: relation.id,
        fid: relation.fid,
        fromTable: relation.fromTable,
        fromField: relation.fromField,
        toTable: relation.toTable,
        toField: relation.toField
      }))
    };
    
    // Generate the transactions JSON
    const transactions = generateTransactions();
    
    // Combine both outputs
    const output = {
      config: configJson,
      transactions: transactions
    };
    
    setJsonOutput(JSON.stringify(output, null, 2));
    setShowSql(true);
  };

      // Update relation properties
      const handleUpdateRelation = (relationId, property, value) => {
        markAsModified('relations', relationId);
        
        setRelations(relations.map(relation => {
          if (relation.fid === relationId) {
            return { ...relation, [property]: value };
          }
          return relation;
        }));
      };

      // Update table name
      const handleUpdateTableName = (tableId, newName) => {
        if (!newName.trim()) return;
        
        markAsModified('tables', tableId);
        
        setTables(tables.map(table => {
          if (table.fid === tableId) {
            return { ...table, name: newName.trim().toLowerCase() };
          }
          return table;
        }));
      };
      
  
  return (
    <div className="flex flex-col h-screen bg-gray-50" style={{"color": "black"}}>
      <header className="bg-green text-white shadow-md" style={{backgroundColor:"#10b981"}}>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center center" style={{display:"flex", "flexDirection": "row", "justifyContent": "center"}}>
            <Database className="mr-4" />
            <h1 className="text-xl font-semibold mt-4">Database</h1>
          </div>
          <button 
            onClick={handleGenerateJson}
            className="bg-white text-indigo-600 px-4 py-2 rounded shadow hover:bg-indigo-50 transition-colors"
          >
            sync
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-md border-r border-gray-200 p-4">
          {/* Tables List Component */}
          <TablesList 
            tables={tables}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
            onCreateTable={handleCreateTable}
            onDeleteTable={handleDeleteTable}
          />
          
          {/* Relations Panel Component */}
          <RelationsPanel 
            tables={tables}
            relations={relations}
            onAddRelation={handleAddRelation}
            onDeleteRelation={handleDeleteRelation}
          />
        </div>
        
        {/* Main Content - Table Editor */}
        <div className="flex-1 p-6 overflow-auto">
          {currentTable ? (
            <TableEditor
              table={currentTable}
              onAddField={handleAddField}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Database size={48} className="mb-4" />
              <p>Select a table or create a new one</p>
            </div>
          )}
        </div>
      </div>
      
      {/* SQL Output Modal */}
      <SqlModal
        isOpen={showSql}
        onClose={() => setShowSql(false)}
        jsonOutput={jsonOutput}
      />
    </div>
  );
}
  
  function TablesList({ tables, activeTable, setActiveTable, onCreateTable, onDeleteTable }) {
    const [isCreatingTable, setIsCreatingTable] = useState(false);
    const [newTableName, setNewTableName] = useState('');
    
    const handleCreateTable = () => {
      if (newTableName.trim()) {
        onCreateTable(newTableName);
        setNewTableName('');
        setIsCreatingTable(false);
      }
    };
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Tables</h2>
          <button 
            onClick={() => setIsCreatingTable(true)}
            className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* New Table Input */}
        {isCreatingTable && (
           <div className="mb-4 flex items-center relative z-20">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Table name"
              className="flex-1 p-2 border border-gray-300 rounded mr-2"
            />
            <button
              onClick={(e) => {console.log("callled save");e.stopPropagation();handleCreateTable();}}
              className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"

            >
              <Save size={18} />
            </button>
            <button
              onClick={(e) => setIsCreatingTable(false)}
              className="ml-1 bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        {/* Tables List */}
        <ul className="space-y-1">
          {tables.map(table => (
            <li 
              key={table.fid}
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                activeTable === table.fid ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTable(table.fid)}
            >
              <div className="flex items-center">
                <TableIcon size={16} className="mr-2" />
                <span>{table.name}</span>
                {table.isNew && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTable(table.fid);
                }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  function RelationsPanel({ tables, relations, onAddRelation, onDeleteRelation }) {
    const [isCreatingRelation, setIsCreatingRelation] = useState(false);
    const [fromTable, setFromTable] = useState('');
    const [fromField, setFromField] = useState('');
    const [toTable, setToTable] = useState('');
    const [toField, setToField] = useState('');
    
    const handleAddRelation = () => {
      if (fromTable && fromField && toTable && toField) {
        onAddRelation(fromTable, fromField, toTable, toField);
        resetForm();
      }
    };
    
    const resetForm = () => {
      setFromTable('');
      setFromField('');
      setToTable('');
      setToField('');
      setIsCreatingRelation(false);
    };
    
    const getTableFields = (tableName) => {
      const table = tables.find(t => t.name === tableName);
      return table ? table.fields : [];
    };
    
    return (
      <div className="mt-6" style={{"height": "600px"}}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Relations</h2>
          <button 
            onClick={() => setIsCreatingRelation(true)}
            className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
            disabled={tables.length < 2}
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Relation Creator */}
        {isCreatingRelation && (
  <div className="flex flex-col h-96 mb-8" style={{"paddingBottom":"30px"}}>
    <div className="bg-indigo-50 p-4 rounded border border-indigo-100 overflow-y-auto" style={{paddingBottom:"50px"}}>
      <h3 className="text-sm font-medium mb-3 text-indigo-700">Create Relation</h3>
      
      <div className="mb-3">
        <label className="block text-xs font-medium mb-1 text-gray-600">From Table</label>
        <select 
          value={fromTable} 
          onChange={(e) => {
            setFromTable(e.target.value);
            setFromField('');
          }}
          className="w-full p-2 text-sm border border-gray-300 rounded mb-2"
        >
          <option value="">Select table</option>
          {tables.map(table => (
            <option key={table.fid} value={table.name}>{table.name}</option>
          ))}
        </select>
        
        {fromTable && (
          <>
            <label className="block text-xs font-medium mb-1 text-gray-600">From Field</label>
            <select 
              value={fromField} 
              onChange={(e) => setFromField(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded mb-2"
            >
              <option value="">Select field</option>
              {getTableFields(fromTable).map(field => (
                <option key={field.fid} value={field.name}>{field.name}</option>
              ))}
            </select>
          </>
        )}
      </div>
      
      <div className="mb-3">
        <label className="block text-xs font-medium mb-1 text-gray-600">To Table</label>
        <select 
          value={toTable} 
          onChange={(e) => {
            setToTable(e.target.value);
            setToField('');
          }}
          className="w-full p-2 text-sm border border-gray-300 rounded mb-2"
        >
          <option value="">Select table</option>
          {tables.map(table => (
            <option key={table.fid} value={table.name}>{table.name}</option>
          ))}
        </select>
        
        {toTable && (
          <>
            <label className="block text-xs font-medium mb-1 text-gray-600">To Field</label>
            <select 
              value={toField} 
              onChange={(e) => setToField(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded mb-2"
            >
              <option value="">Select field</option>
              {getTableFields(toTable).map(field => (
                <option key={field.fid} value={field.name}>{field.name}</option>
              ))}
            </select>
          </>
        )}
      </div>
      
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleAddRelation}
          disabled={!fromTable || !fromField || !toTable || !toField}
          className={`flex-1 py-2 rounded text-sm ${
            !fromTable || !fromField || !toTable || !toField
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Add
        </button>
        <button
          onClick={resetForm}
          className="flex-1 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
        
        {/* Relations List */}
        <div className="space-y-2 mt-3">
          {relations.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No relations defined</p>
          ) : (
            relations.map(relation => (
<div key={relation.fid} className="bg-white border border-gray-200 rounded p-2 shadow-sm">
  <div className="flex justify-between items-center">
    <div className="flex items-center overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <ArrowRight size={14} className="text-indigo-600 mx-1 flex-shrink-0" />
      <div className="text-sm whitespace-nowrap overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <span className="font-medium">{relation.fromTable}</span>
        <span className="text-gray-500 mx-1">{relation.fromField}</span>
        <span className="mx-1">→</span>
        <span className="font-medium">{relation.toTable}</span>
        <span className="text-gray-500 mx-1">{relation.toField}</span>
      </div>
    </div>
    <button
      onClick={() => onDeleteRelation(relation.fid)}
      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
    >
      <Trash2 size={14} />
    </button>
  </div>
  {relation.isNew && (
    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">New</span>
  )}
</div>
            ))
          )}
        </div>
      </div>
    );
  }
  
  // Data types for PostgreSQL
  const DATA_TYPES = [
    'VARCHAR', 'TEXT', 'INTEGER', 'BIGINT', 'SMALLINT', 
    'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP', 'DECIMAL', 
    'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'JSON', 'JSONB',
    'UUID', 'SERIAL', 'BIGSERIAL'
  ];
  
  function TableEditor({ table, onAddField, onUpdateField, onDeleteField }) {
    const [activeFieldId, setActiveFieldId] = useState(null);
    
    const handleFieldClick = (fieldId) => {
      setActiveFieldId(activeFieldId === fieldId ? null : fieldId);
    };
    
    const handleAddField = () => {
      const newFieldId = onAddField(table.fid);
      // Automatically open the new field for editing
      setActiveFieldId(newFieldId);
    };
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {table.name}
            {table.isNew && (
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">New Table</span>
            )}
          </h2>
          <button
            onClick={handleAddField}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Field
          </button>
        </div>
        
        {/* Fields List */}
        <div className="space-y-2" style={{"display": "flex", "flexDirection": "column", "alignItems": "center"}}>
          {table.fields.map(field => (
            <div key={field.fid} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{minWidth:"400px"}}>
              {/* Field Header - Always visible */}
              <div 
                className={`flex items-center justify-between p-3 cursor-pointer ${activeFieldId === field.fid ? 'bg-indigo-50 border-b border-indigo-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleFieldClick(field.fid)}
              >
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="font-medium">{field.name || 'Unnamed Field'}</span>
                      {field.isNew && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">New</span>
                      )}
                      {field.primaryKey && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">PK</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500"  style={{"fontSize": "0.6em"}}>{field.type}{field.length ? `(${field.length})` : ''}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFieldClick(field.fid);
                    }}
                    className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    {activeFieldId === field.fid ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteField(table.fid, field.fid);
                    }}
                    disabled={field.primaryKey}
                    className={`ml-1 p-1 rounded-full ${
                      field.primaryKey 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Field Details - Only visible when active */}
              {activeFieldId === field.fid && (
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={field.name || ''}
                        onChange={(e) => onUpdateField(table.fid, field.fid, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Field name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => onUpdateField(table.fid, field.fid, 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        {DATA_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    {['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(field.type) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Length/Precision</label>
                        <input
                          type="number"
                          value={field.length || ''}
                          onChange={(e) => onUpdateField(table.fid, field.fid, 'length', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Length"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
                      <input
                        type="text"
                        value={field.defaultValue || ''}
                        onChange={(e) => onUpdateField(table.fid, field.fid, 'defaultValue', e.target.value || null)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Default value"
                      />
                    </div>
                    
                    <div className="col-span-2 flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.primaryKey || false}
                          onChange={(e) => onUpdateField(table.fid, field.fid, 'primaryKey', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Primary Key</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!field.nullable}
                          onChange={(e) => onUpdateField(table.fid, field.fid, 'nullable', !e.target.checked)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {table.fields.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">No fields defined yet. Click "Add Field" to create one.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
function SqlModal({ isOpen, onClose, jsonOutput }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">JSON Output</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {jsonOutput}
          </pre>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}