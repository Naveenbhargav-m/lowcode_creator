/**
 * Database Schema Migration Utility
 * Generates transactions needed to transform an original schema into a current schema.
 * 
 * The function analyzes differences between two database schema states and produces
 * a sequence of operations (transactions) that when executed will transform the
 * original schema into the current schema.
 */

/**
 * Generates database schema migration transactions
 * @returns {Array} Ordered list of transactions to transform original schema to current schema
 */
export function GenerateTransactionsV2(originalTables, tables, originalRelations, relations) {
    // Initialize transaction list
    const transactions = [];
    
    // Create schema comparators for original and current states
    const originalSchema = new SchemaState(originalTables, originalRelations);
    const currentSchema = new SchemaState(tables, relations);
    
    // Process schema differences in the correct order
    processTableRenames(originalSchema, currentSchema, transactions);
    processTableDrops(originalSchema, currentSchema, transactions);
    processTableCreations(originalSchema, currentSchema, transactions);
    processFieldChanges(originalSchema, currentSchema, transactions);
    processRelationChanges(originalSchema, currentSchema, transactions);
    
    // Sort transactions to ensure proper execution order
    sortTransactionsByPriority(transactions);
    
    return transactions;
  };
  
  /**
   * Represents a database schema state
   */
  class SchemaState {
    /**
     * @param {Array} tables - List of tables in the schema
     * @param {Array} relations - List of relations in the schema
     */
    constructor(tables, relations) {
      // Create deep copies to avoid mutating original data
      const tablesCopy = structuredClone(tables);
      const relationsCopy = structuredClone(relations);
      
      // Initialize lookup maps
      this.tablesById = new Map();
      this.tablesByName = new Map();
      this.relationsById = new Map();
      this.relationsByKey = new Map();
      
      // Populate table maps
      tablesCopy.forEach(table => {
        this.tablesById.set(table.fid, table);
        this.tablesByName.set(table.name, table);
        
        // Create field lookup maps for each table
        table.fieldsById = new Map();
        table.fieldsByName = new Map();
        
        table.fields.forEach(field => {
          table.fieldsById.set(field.fid, field);
          table.fieldsByName.set(field.name, field);
        });
      });
      
      // Populate relation maps
      relationsCopy.forEach(relation => {
        this.relationsById.set(relation.fid, relation);
        
        // Create a composite key for relation lookup
        const relationKey = this.createRelationKey(relation);
        this.relationsByKey.set(relationKey, relation);
      });
      
      this.tables = tablesCopy;
      this.relations = relationsCopy;
    }
    
    /**
     * Creates a unique key for a relation
     * @param {Object} relation - Relation object
     * @returns {String} Unique key
     */
    createRelationKey(relation) {
      return `${relation.fromTable}.${relation.fromField}->${relation.toTable}.${relation.toField}`;
    }
    
    /**
     * Updates table name references after a table rename
     * @param {String} oldName - Previous table name
     * @param {String} newName - New table name
     */
    updateTableName(oldName, newName) {
      const table = this.tablesByName.get(oldName);
      if (table) {
        // Update table name
        table.name = newName;
        
        // Update maps
        this.tablesByName.delete(oldName);
        this.tablesByName.set(newName, table);
      }
    }
    
    /**
     * Updates field name references after a field rename
     * @param {String} tableId - ID of the table containing the field
     * @param {String} oldName - Previous field name
     * @param {String} newName - New field name
     */
    updateFieldName(tableId, oldName, newName) {
      const table = this.tablesById.get(tableId);
      if (table) {
        const field = table.fieldsByName.get(oldName);
        if (field) {
          // Update field name
          field.name = newName;
          
          // Update maps
          table.fieldsByName.delete(oldName);
          table.fieldsByName.set(newName, field);
        }
      }
    }
  }
  
  /**
   * Processes table renames between original and current schema
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   */
  function processTableRenames(originalSchema, currentSchema, transactions) {
    // Find table renames (same ID, different name)
    const tableRenames = [];
    
    for (const [tableId, originalTable] of originalSchema.tablesById) {
      const currentTable = currentSchema.tablesById.get(tableId);
      
      // If table exists in both schemas but with different names
      if (currentTable && originalTable.name !== currentTable.name) {
        tableRenames.push({
          tableId,
          oldName: originalTable.name,
          newName: currentTable.name
        });
      }
    }
    
    // Handle renames with dependency resolution
    const renameGraph = new RenameGraph(tableRenames);
    const orderedRenames = renameGraph.getSortedRenames();
    
    // Create transactions for the renames
    for (const rename of orderedRenames) {
      if (rename.isTemporary) {
        // Add temporary rename transaction
        transactions.push({
          id: `rename_table_temp_${rename.tableId}`,
          type: 'rename_table',
          oldName: rename.oldName,
          newName: rename.tempName
        });
        
        // Add final rename transaction
        transactions.push({
          id: `rename_table_final_${rename.tableId}`,
          type: 'rename_table',
          oldName: rename.tempName,
          newName: rename.newName
        });
      } else {
        // Add direct rename transaction
        transactions.push({
          id: `rename_table_${rename.tableId}`,
          type: 'rename_table',
          oldName: rename.oldName,
          newName: rename.newName
        });
      }
      
      // Update table name in original schema to maintain consistency
      originalSchema.updateTableName(rename.oldName, rename.newName);
    }
  }
  
  /**
   * Helper class to resolve rename dependencies using graph-based approach
   */
  class RenameGraph {
    /**
     * @param {Array} renames - List of rename operations
     */
    constructor(renames) {
      this.renames = renames;
      this.nameToRename = new Map();
      
      // Build lookup for renames by name
      for (const rename of renames) {
        this.nameToRename.set(rename.oldName, rename);
      }
    }
    
    /**
     * Get renames sorted to handle dependencies
     * @returns {Array} Sorted rename operations
     */
    getSortedRenames() {
      const result = [];
      const processed = new Set();
      let tempNameCounter = 0;
      
      // Create a working copy of renames
      const pendingRenames = [...this.renames];
      
      // Process renames until all are handled
      while (pendingRenames.length > 0) {
        let progress = false;
        
        // Try to find a rename that doesn't conflict with remaining renames
        for (let i = 0; i < pendingRenames.length; i++) {
          const rename = pendingRenames[i];
          
          // Check if this rename conflicts with any other pending rename
          const hasConflict = pendingRenames.some(
            otherRename => otherRename !== rename && otherRename.oldName === rename.newName
          );
          
          if (!hasConflict) {
            // No conflict, can process this rename
            result.push(rename);
            processed.add(rename);
            pendingRenames.splice(i, 1);
            progress = true;
            break;
          }
        }
        
        // If we couldn't make progress, break a circular dependency with temp name
        if (!progress && pendingRenames.length > 0) {
          const rename = pendingRenames[0];
          const tempName = `_temp_${rename.oldName}_${Date.now()}_${tempNameCounter++}`;
          
          // Mark this rename as requiring a temporary step
          rename.isTemporary = true;
          rename.tempName = tempName;
          
          result.push(rename);
          processed.add(rename);
          pendingRenames.splice(0, 1);
        }
      }
      
      return result;
    }
  }
  
  /**
   * Processes table drops between original and current schema
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   */
  function processTableDrops(originalSchema, currentSchema, transactions) {
    // Find tables that exist in original but not in current (by ID)
    for (const [tableId, table] of originalSchema.tablesById) {
      if (!currentSchema.tablesById.has(tableId)) {
        transactions.push({
          id: `drop_table_${tableId}`,
          type: 'drop_table',
          table: table.name
        });
      }
    }
  }
  
  /**
   * Processes table creations between original and current schema
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   */
  function processTableCreations(originalSchema, currentSchema, transactions) {
    // Find tables that exist in current but not in original (by ID)
    for (const [tableId, table] of currentSchema.tablesById) {
      if (!originalSchema.tablesById.has(tableId)) {
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
  }
  
  /**
   * Processes field changes between original and current schema
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   */
  function processFieldChanges(originalSchema, currentSchema, transactions) {
    // Process each table that exists in both schemas
    for (const [tableId, currentTable] of currentSchema.tablesById) {
      const originalTable = originalSchema.tablesById.get(tableId);
      if (!originalTable) continue; // Skip tables that only exist in current schema
      
      const tableName = currentTable.name; // Use current name (after potential rename)
      
      // Process field renames
      processFieldRenames(originalTable, currentTable, tableName, transactions);
      
      // Process fields with same name but different IDs
      processSameNameFields(originalTable, currentTable, tableName, transactions);
      
      // Process dropped fields
      processDroppedFields(originalTable, currentTable, tableName, transactions);
      
      // Process new fields
      processNewFields(originalTable, currentTable, tableName, transactions);
      
      // Process modified fields
      processModifiedFields(originalTable, currentTable, tableName, transactions);
    }
  }
  
  /**
   * Processes field renames within a table
   * @param {Object} originalTable - Original table
   * @param {Object} currentTable - Current table
   * @param {String} tableName - Current table name
   * @param {Array} transactions - Transaction list to append to
   */
  function processFieldRenames(originalTable, currentTable, tableName, transactions) {
    // Find field renames (same ID, different name)
    const fieldRenames = [];
    
    for (const [fieldId, originalField] of originalTable.fieldsById) {
      const currentField = currentTable.fieldsById.get(fieldId);
      
      // If field exists in both tables but with different names
      if (currentField && originalField.name !== currentField.name) {
        fieldRenames.push({
          tableId: originalTable.fid,
          fieldId,
          oldName: originalField.name,
          newName: currentField.name
        });
      }
    }
    
    // Handle renames with dependency resolution
    const renameGraph = new RenameGraph(fieldRenames);
    const orderedRenames = renameGraph.getSortedRenames();
    
    // Create transactions for the renames
    for (const rename of orderedRenames) {
      if (rename.isTemporary) {
        // Add temporary rename transaction
        transactions.push({
          id: `rename_field_temp_${rename.tableId}_${rename.fieldId}`,
          type: 'rename_field',
          table: tableName,
          oldName: rename.oldName,
          newName: rename.tempName
        });
        
        // Add final rename transaction
        transactions.push({
          id: `rename_field_final_${rename.tableId}_${rename.fieldId}`,
          type: 'rename_field',
          table: tableName,
          oldName: rename.tempName,
          newName: rename.newName
        });
      } else {
        // Add direct rename transaction
        transactions.push({
          id: `rename_field_${rename.tableId}_${rename.fieldId}`,
          type: 'rename_field',
          table: tableName,
          oldName: rename.oldName,
          newName: rename.newName
        });
      }
      
      // Update field name in original table
      originalTable.fieldsByName.delete(rename.oldName);
      originalTable.fieldsByName.set(rename.newName, originalTable.fieldsById.get(rename.fieldId));
      originalTable.fieldsById.get(rename.fieldId).name = rename.newName;
    }
  }
  
  /**
   * Processes fields with same name but different IDs
   * @param {Object} originalTable - Original table
   * @param {Object} currentTable - Current table
   * @param {String} tableName - Current table name
   * @param {Array} transactions - Transaction list to append to
   */
  function processSameNameFields(originalTable, currentTable, tableName, transactions) {
    const processedFields = new Set();
    
    // Check for fields with same name but different IDs
    for (const [fieldName, originalField] of originalTable.fieldsByName) {
      const currentField = currentTable.fieldsByName.get(fieldName);
      
      if (currentField && originalField.fid !== currentField.fid) {
        // This means one field was dropped and another created with the same name
        transactions.push({
          id: `drop_field_samename_${originalTable.fid}_${originalField.fid}`,
          type: 'drop_field',
          table: tableName,
          field: fieldName
        });
        
        transactions.push({
          id: `add_field_samename_${originalTable.fid}_${currentField.fid}`,
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
        processedFields.add(fieldName);
      }
    }
    
    return processedFields;
  }
  
  /**
   * Processes dropped fields
   * @param {Object} originalTable - Original table
   * @param {Object} currentTable - Current table
   * @param {String} tableName - Current table name
   * @param {Array} transactions - Transaction list to append to
   * @param {Set} processedFields - Fields already processed
   */
  function processDroppedFields(originalTable, currentTable, tableName, transactions, processedFields = new Set()) {
    // Find fields that exist in original but not in current (by ID)
    for (const [fieldId, field] of originalTable.fieldsById) {
      if (!currentTable.fieldsById.has(fieldId) && !processedFields.has(field.name)) {
        transactions.push({
          id: `drop_field_${originalTable.fid}_${fieldId}`,
          type: 'drop_field',
          table: tableName,
          field: field.name
        });
      }
    }
  }
  
  /**
   * Processes new fields
   * @param {Object} originalTable - Original table
   * @param {Object} currentTable - Current table
   * @param {String} tableName - Current table name
   * @param {Array} transactions - Transaction list to append to
   * @param {Set} processedFields - Fields already processed
   */
  function processNewFields(originalTable, currentTable, tableName, transactions, processedFields = new Set()) {
    // Find fields that exist in current but not in original (by ID)
    for (const [fieldId, field] of currentTable.fieldsById) {
      if (!originalTable.fieldsById.has(fieldId) && !processedFields.has(field.name)) {
        transactions.push({
          id: `add_field_${originalTable.fid}_${fieldId}`,
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
  
  /**
   * Processes modified fields
   * @param {Object} originalTable - Original table
   * @param {Object} currentTable - Current table
   * @param {String} tableName - Current table name
   * @param {Array} transactions - Transaction list to append to
   */
  function processModifiedFields(originalTable, currentTable, tableName, transactions) {
    // Check each field that exists in both tables
    for (const [fieldId, currentField] of currentTable.fieldsById) {
      const originalField = originalTable.fieldsById.get(fieldId);
      if (!originalField) continue; // Skip fields that only exist in current table
      
      // Skip if only the name changed (already handled in renames)
      if (originalField.name !== currentField.name && 
          !hasFieldPropertiesChanged(originalField, currentField)) {
        continue;
      }
      
      // Check for modifications to field properties
      const modifications = getFieldModifications(originalField, currentField);
      
      // Handle primary key changes separately
      if ('primaryKey' in modifications) {
        const pkTransaction = handlePrimaryKeyChange(
          originalTable.fid, 
          originalField, 
          currentField, 
          tableName
        );
        
        if (pkTransaction) {
          transactions.push(pkTransaction);
          delete modifications.primaryKey; // Remove from regular modifications
        }
      }
      
      // Only create a transaction if there are modifications
      if (Object.keys(modifications).length > 0) {
        transactions.push({
          id: `alter_field_${originalTable.fid}_${fieldId}`,
          type: 'alter_field',
          table: tableName,
          field: currentField.name, // Use current name after potential rename
          modifications
        });
      }
    }
  }
  
  /**
   * Processes relation changes between original and current schema
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   */
  function processRelationChanges(originalSchema, currentSchema, transactions) {
    // Track processed relations to avoid duplicates
    const processedRelations = new Set();
    
    // Process relations with same definition but different IDs
    processRedundantRelations(originalSchema, currentSchema, processedRelations);
    
    // Process dropped relations
    processDroppedRelations(originalSchema, currentSchema, transactions, processedRelations);
    
    // Process new relations
    processNewRelations(originalSchema, currentSchema, transactions, processedRelations);
    
    // Process modified relations
    processModifiedRelations(originalSchema, currentSchema, transactions, processedRelations);
  }
  
  /**
   * Processes relations with same definition but different IDs
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Set} processedRelations - Set of processed relation IDs
   */
  function processRedundantRelations(originalSchema, currentSchema, processedRelations) {
    // Find relations with same definition but different IDs
    for (const [key, originalRelation] of originalSchema.relationsByKey) {
      const currentRelation = currentSchema.relationsByKey.get(key);
      
      if (currentRelation && originalRelation.fid !== currentRelation.fid) {
        // No need to drop and recreate if they're functionally identical
        processedRelations.add(originalRelation.fid);
        processedRelations.add(currentRelation.fid);
      }
    }
  }
  
  /**
   * Processes dropped relations
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   * @param {Set} processedRelations - Set of processed relation IDs
   */
  function processDroppedRelations(originalSchema, currentSchema, transactions, processedRelations) {
    // Find relations that exist in original but not in current (by ID)
    for (const [relationId, relation] of originalSchema.relationsById) {
      if (!currentSchema.relationsById.has(relationId) && !processedRelations.has(relationId)) {
        transactions.push({
          id: `drop_relation_${relationId}`,
          type: 'drop_foreign_key',
          constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
          sourceTable: relation.fromTable
        });
        
        processedRelations.add(relationId);
      }
    }
  }
  
  /**
   * Processes new relations
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   * @param {Set} processedRelations - Set of processed relation IDs
   */
  function processNewRelations(originalSchema, currentSchema, transactions, processedRelations) {
    // Find relations that exist in current but not in original (by ID)
    for (const [relationId, relation] of currentSchema.relationsById) {
      if (!originalSchema.relationsById.has(relationId) && !processedRelations.has(relationId)) {
        transactions.push({
          id: `create_relation_${relationId}`,
          type: 'create_foreign_key',
          constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
          sourceTable: relation.fromTable,
          sourceColumn: relation.fromField,
          targetTable: relation.toTable,
          targetColumn: relation.toField
        });
        
        processedRelations.add(relationId);
      }
    }
  }
  
  /**
   * Processes modified relations
   * @param {SchemaState} originalSchema - Original schema state
   * @param {SchemaState} currentSchema - Current schema state
   * @param {Array} transactions - Transaction list to append to
   * @param {Set} processedRelations - Set of processed relation IDs
   */
  function processModifiedRelations(originalSchema, currentSchema, transactions, processedRelations) {
    // Check each relation that exists in both schemas
    for (const [relationId, currentRelation] of currentSchema.relationsById) {
      const originalRelation = originalSchema.relationsById.get(relationId);
      
      if (!originalRelation || processedRelations.has(relationId)) continue;
      
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
  }
  
  /**
   * Sorts transactions to ensure proper execution order
   * @param {Array} transactions - List of transactions to sort
   */
  function sortTransactionsByPriority(transactions) {
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
  }
  
  /**
   * Checks if a field's properties have changed
   * @param {Object} originalField - Original field
   * @param {Object} currentField - Current field
   * @returns {Boolean} True if properties have changed
   */
  function hasFieldPropertiesChanged(originalField, currentField) {
    // Check case-sensitivity if names differ only by case
    const isCaseSensitive = true; // Set based on your database
    
    if (isCaseSensitive && 
        originalField.name.toLowerCase() === currentField.name.toLowerCase() && 
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
  
  /**
   * Gets field modifications
   * @param {Object} originalField - Original field
   * @param {Object} currentField - Current field
   * @returns {Object} Modifications object
   */
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
  
  /**
   * Normalizes field values for comparison
   * @param {*} value - Field value to normalize
   * @returns {*} Normalized value
   */
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
  
  /**
   * Checks if a relation has changed
   * @param {Object} originalRelation - Original relation
   * @param {Object} currentRelation - Current relation
   * @returns {Boolean} True if relation has changed
   */
  function hasRelationChanged(originalRelation, currentRelation) {
    return originalRelation.fromTable !== currentRelation.fromTable ||
           originalRelation.fromField !== currentRelation.fromField ||
           originalRelation.toTable !== currentRelation.toTable ||
           originalRelation.toField !== currentRelation.toField;
  }
  
  /**
   * Creates a transaction for primary key changes
   * @param {String} tableId - Table ID
   * @param {Object} originalField - Original field
   * @param {Object} currentField - Current field
   * @param {String} tableName - Table name
   * @returns {Object|null} Primary key transaction or null if no change
   */
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