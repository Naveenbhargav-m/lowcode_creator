// Enhanced Database Change Tracker with improved rename detection and validation

export const TRANSACTION_TYPES = {
    // Table operations
    CREATE_TABLE: 'CREATE_TABLE',
    DROP_TABLE: 'DROP_TABLE',
    RENAME_TABLE: 'RENAME_TABLE',
    
    // Field operations
    ADD_FIELD: 'ADD_FIELD',
    DROP_FIELD: 'DROP_FIELD',
    RENAME_FIELD: 'RENAME_FIELD',
    CHANGE_FIELD_TYPE: 'CHANGE_FIELD_TYPE',
    CHANGE_FIELD_NULLABLE: 'CHANGE_FIELD_NULLABLE',
    CHANGE_FIELD_DEFAULT: 'CHANGE_FIELD_DEFAULT',
    ADD_PRIMARY_KEY: 'ADD_PRIMARY_KEY',
    DROP_PRIMARY_KEY: 'DROP_PRIMARY_KEY',
    
    // Relation operations
    ADD_RELATION: 'ADD_RELATION',
    DROP_RELATION: 'DROP_RELATION',
    
    // Composite operations
    RECREATE_TABLE: 'RECREATE_TABLE' // For complex changes requiring table recreation
  };
  
  // Enhanced change detection with rename inference
  class ChangeDetector {
    constructor(options = {}) {
      this.options = {
        // Similarity threshold for detecting renames (0-1)
        renameSimilarityThreshold: 0.7,
        // Whether to use fuzzy matching for rename detection
        useFuzzyMatching: true,
        // Whether to preserve FIDs when possible
        preserveFids: true,
        ...options
      };
    }
  
    detectChanges(originalData, currentData) {
      const changes = [];
      
      // First pass: Detect table-level changes
      const tableChanges = this._detectTableChanges(originalData.tables, currentData.tables);
      changes.push(...tableChanges);
      
      // Second pass: Detect field-level changes (only for existing tables)
      const fieldChanges = this._detectFieldChanges(
        originalData.tables, 
        currentData.tables, 
        tableChanges
      );
      changes.push(...fieldChanges);
      
      // Third pass: Detect relation changes
      const relationChanges = this._detectRelationChanges(
        originalData.relations, 
        currentData.relations
      );
      changes.push(...relationChanges);
      
      return this._optimizeChanges(changes);
    }
  
    _detectTableChanges(originalTables, currentTables) {
      const changes = [];
      const originalMap = new Map(originalTables.map(t => [t.fid, t]));
      const currentMap = new Map(currentTables.map(t => [t.fid, t]));
      
      // Track which tables we've processed
      const processedOriginal = new Set();
      const processedCurrent = new Set();
      
      // 1. Find exact matches by FID (existing tables)
      for (const [fid, currentTable] of currentMap) {
        const originalTable = originalMap.get(fid);
        if (originalTable) {
          processedOriginal.add(fid);
          processedCurrent.add(fid);
          
          // Check for table rename
          if (originalTable.name !== currentTable.name) {
            changes.push({
              type: TRANSACTION_TYPES.RENAME_TABLE,
              priority: 10,
              tableFid: fid,
              oldName: originalTable.name,
              newName: currentTable.name,
              metadata: { confidence: 1.0 }
            });
          }
        }
      }
      
      // 2. Find potential renames among unmatched tables
      const unmatchedOriginal = originalTables.filter(t => !processedOriginal.has(t.fid));
      const unmatchedCurrent = currentTables.filter(t => !processedCurrent.has(t.fid));
      
      const renameMatches = this._findBestRenameMatches(unmatchedOriginal, unmatchedCurrent);
      
      for (const match of renameMatches) {
        processedOriginal.add(match.original.fid);
        processedCurrent.add(match.current.fid);
        
        changes.push({
          type: TRANSACTION_TYPES.RENAME_TABLE,
          priority: 10,
          tableFid: match.current.fid, // Use current FID
          oldName: match.original.name,
          newName: match.current.name,
          metadata: { 
            confidence: match.confidence,
            fidChanged: match.original.fid !== match.current.fid,
            originalFid: match.original.fid
          }
        });
      }
      
      // 3. Remaining unmatched tables are drops/creates
      for (const table of unmatchedOriginal) {
        if (!processedOriginal.has(table.fid)) {
          changes.push({
            type: TRANSACTION_TYPES.DROP_TABLE,
            priority: 100,
            tableFid: table.fid,
            tableName: table.name,
            metadata: { 
              hasData: true, // Assume existing table has data
              affectedRelations: this._getAffectedRelations(table.name, [])
            }
          });
        }
      }
      
      for (const table of unmatchedCurrent) {
        if (!processedCurrent.has(table.fid)) {
          changes.push({
            type: TRANSACTION_TYPES.CREATE_TABLE,
            priority: 1,
            tableFid: table.fid,
            tableName: table.name,
            fields: table.fields,
            metadata: { confidence: 1.0 }
          });
        }
      }
      
      return changes;
    }
  
    _findBestRenameMatches(originalTables, currentTables) {
      if (!this.options.useFuzzyMatching || originalTables.length === 0 || currentTables.length === 0) {
        return [];
      }
      
      const matches = [];
      const usedCurrent = new Set();
      
      // Calculate similarity scores for all combinations
      const scores = [];
      for (const original of originalTables) {
        for (const current of currentTables) {
          if (usedCurrent.has(current.fid)) continue;
          
          const score = this._calculateTableSimilarity(original, current);
          if (score >= this.options.renameSimilarityThreshold) {
            scores.push({ original, current, confidence: score });
          }
        }
      }
      
      // Sort by confidence and select best matches
      scores.sort((a, b) => b.confidence - a.confidence);
      
      const usedOriginal = new Set();
      for (const score of scores) {
        if (!usedOriginal.has(score.original.fid) && !usedCurrent.has(score.current.fid)) {
          matches.push(score);
          usedOriginal.add(score.original.fid);
          usedCurrent.add(score.current.fid);
        }
      }
      
      return matches;
    }
  
    _calculateTableSimilarity(originalTable, currentTable) {
      let score = 0;
      let factors = 0;
      
      // Name similarity (using Levenshtein distance)
      const nameSimilarity = this._calculateStringSimilarity(originalTable.name, currentTable.name);
      score += nameSimilarity * 0.3;
      factors += 0.3;
      
      // Field structure similarity
      const fieldSimilarity = this._calculateFieldStructureSimilarity(originalTable.fields, currentTable.fields);
      score += fieldSimilarity * 0.7;
      factors += 0.7;
      
      return factors > 0 ? score / factors : 0;
    }
  
    _calculateFieldStructureSimilarity(originalFields, currentFields) {
      if (originalFields.length === 0 && currentFields.length === 0) return 1;
      if (originalFields.length === 0 || currentFields.length === 0) return 0;
      
      const originalFieldNames = new Set(originalFields.map(f => f.name.toLowerCase()));
      const currentFieldNames = new Set(currentFields.map(f => f.name.toLowerCase()));
      
      const intersection = new Set([...originalFieldNames].filter(x => currentFieldNames.has(x)));
      const union = new Set([...originalFieldNames, ...currentFieldNames]);
      
      return intersection.size / union.size; // Jaccard similarity
    }
  
    _calculateStringSimilarity(str1, str2) {
      if (str1 === str2) return 1;
      if (str1.length === 0 || str2.length === 0) return 0;
      
      // Simple Levenshtein distance implementation
      const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
      
      for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
      for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
      
      for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
          const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j - 1][i] + 1,     // deletion
            matrix[j][i - 1] + 1,     // insertion
            matrix[j - 1][i - 1] + cost // substitution
          );
        }
      }
      
      const maxLength = Math.max(str1.length, str2.length);
      return (maxLength - matrix[str2.length][str1.length]) / maxLength;
    }
  
    _detectFieldChanges(originalTables, currentTables, tableChanges) {
      const changes = [];
      const currentTableMap = new Map(currentTables.map(t => [t.fid, t]));
      const originalTableMap = new Map(originalTables.map(t => [t.fid, t]));
      
      // Get table renames to map old names to new names
      const tableRenames = new Map();
      tableChanges
        .filter(c => c.type === TRANSACTION_TYPES.RENAME_TABLE)
        .forEach(c => tableRenames.set(c.oldName, c.newName));
      
      for (const [fid, currentTable] of currentTableMap) {
        const originalTable = originalTableMap.get(fid);
        if (!originalTable) continue; // Skip new tables
        
        const fieldChanges = this._detectFieldChangesForTable(originalTable, currentTable);
        changes.push(...fieldChanges);
      }
      
      return changes;
    }
  
    _detectFieldChangesForTable(originalTable, currentTable) {
      const changes = [];
      const originalFieldMap = new Map(originalTable.fields.map(f => [f.fid, f]));
      const currentFieldMap = new Map(currentTable.fields.map(f => [f.fid, f]));
      
      // Track processed fields
      const processedOriginal = new Set();
      const processedCurrent = new Set();
      
      // 1. Find exact matches by FID
      for (const [fid, currentField] of currentFieldMap) {
        const originalField = originalFieldMap.get(fid);
        if (originalField) {
          processedOriginal.add(fid);
          processedCurrent.add(fid);
          
          // Detect field property changes
          const propertyChanges = this._detectFieldPropertyChanges(
            currentTable.name, 
            originalField, 
            currentField
          );
          changes.push(...propertyChanges);
        }
      }
      
      // 2. Find potential field renames
      const unmatchedOriginal = originalTable.fields.filter(f => !processedOriginal.has(f.fid));
      const unmatchedCurrent = currentTable.fields.filter(f => !processedCurrent.has(f.fid));
      
      const fieldRenameMatches = this._findBestFieldRenameMatches(unmatchedOriginal, unmatchedCurrent);
      
      for (const match of fieldRenameMatches) {
        processedOriginal.add(match.original.fid);
        processedCurrent.add(match.current.fid);
        
        changes.push({
          type: TRANSACTION_TYPES.RENAME_FIELD,
          priority: 20,
          tableName: currentTable.name,
          fieldFid: match.current.fid,
          oldName: match.original.name,
          newName: match.current.name,
          metadata: { 
            confidence: match.confidence,
            fidChanged: match.original.fid !== match.current.fid
          }
        });
        
        // Also check for other property changes after rename
        const propertyChanges = this._detectFieldPropertyChanges(
          currentTable.name,
          { ...match.original, name: match.current.name }, // Use new name for comparison
          match.current
        );
        changes.push(...propertyChanges);
      }
      
      // 3. Remaining fields are drops/creates
      for (const field of unmatchedOriginal) {
        if (!processedOriginal.has(field.fid)) {
          changes.push({
            type: TRANSACTION_TYPES.DROP_FIELD,
            priority: 90,
            tableName: currentTable.name,
            fieldFid: field.fid,
            fieldName: field.name,
            metadata: { 
              hasData: true,
              type: field.type
            }
          });
        }
      }
      
      for (const field of unmatchedCurrent) {
        if (!processedCurrent.has(field.fid)) {
          changes.push({
            type: TRANSACTION_TYPES.ADD_FIELD,
            priority: 15,
            tableName: currentTable.name,
            fieldFid: field.fid,
            field: field,
            metadata: { confidence: 1.0 }
          });
        }
      }
      
      return changes;
    }
  
    _findBestFieldRenameMatches(originalFields, currentFields) {
      if (!this.options.useFuzzyMatching || originalFields.length === 0 || currentFields.length === 0) {
        return [];
      }
      
      const matches = [];
      const scores = [];
      
      for (const original of originalFields) {
        for (const current of currentFields) {
          const score = this._calculateFieldSimilarity(original, current);
          if (score >= this.options.renameSimilarityThreshold) {
            scores.push({ original, current, confidence: score });
          }
        }
      }
      
      // Select best non-conflicting matches
      scores.sort((a, b) => b.confidence - a.confidence);
      
      const usedOriginal = new Set();
      const usedCurrent = new Set();
      
      for (const score of scores) {
        if (!usedOriginal.has(score.original.fid) && !usedCurrent.has(score.current.fid)) {
          matches.push(score);
          usedOriginal.add(score.original.fid);
          usedCurrent.add(score.current.fid);
        }
      }
      
      return matches;
    }
  
    _calculateFieldSimilarity(originalField, currentField) {
      let score = 0;
      let factors = 0;
      
      // Name similarity
      const nameSimilarity = this._calculateStringSimilarity(originalField.name, currentField.name);
      score += nameSimilarity * 0.4;
      factors += 0.4;
      
      // Type compatibility
      const typeCompatible = this._areTypesCompatible(originalField.type, currentField.type);
      score += (typeCompatible ? 1 : 0) * 0.6;
      factors += 0.6;
      
      return factors > 0 ? score / factors : 0;
    }
  
    _areTypesCompatible(type1, type2) {
      if (type1 === type2) return true;
      
      // Define compatible type groups
      const compatibleGroups = [
        ['INTEGER', 'BIGINT', 'SMALLINT'],
        ['REAL', 'DOUBLE PRECISION', 'NUMERIC', 'DECIMAL'],
        ['VARCHAR', 'TEXT', 'CHAR'],
        ['DATE', 'TIMESTAMP', 'TIME']
      ];
      
      return compatibleGroups.some(group => 
        group.includes(type1) && group.includes(type2)
      );
    }
  
    _detectFieldPropertyChanges(tableName, originalField, currentField) {
      const changes = [];
      
      // Type or length changes
      const originalFullType = this._getFullType(originalField);
      const currentFullType = this._getFullType(currentField);
      
      if (originalFullType !== currentFullType) {
        changes.push({
          type: TRANSACTION_TYPES.CHANGE_FIELD_TYPE,
          priority: 30,
          tableName,
          fieldName: currentField.name,
          oldType: originalFullType,
          newType: currentFullType,
          metadata: {
            potentialDataLoss: this._isDataLossyChange(originalFullType, currentFullType),
            requiresTableRecreation: this._requiresTableRecreation(originalField, currentField)
          }
        });
      }
      
      // Nullable change
      if (originalField.nullable !== currentField.nullable) {
        changes.push({
          type: TRANSACTION_TYPES.CHANGE_FIELD_NULLABLE,
          priority: 40,
          tableName,
          fieldName: currentField.name,
          oldNullable: originalField.nullable,
          newNullable: currentField.nullable,
          metadata: {
            requiresValidation: !currentField.nullable // Making field required
          }
        });
      }
      
      // Default value change
      if (originalField.defaultValue !== currentField.defaultValue) {
        changes.push({
          type: TRANSACTION_TYPES.CHANGE_FIELD_DEFAULT,
          priority: 50,
          tableName,
          fieldName: currentField.name,
          oldDefault: originalField.defaultValue,
          newDefault: currentField.defaultValue
        });
      }
      
      // Primary key changes
      if (originalField.primaryKey !== currentField.primaryKey) {
        if (currentField.primaryKey) {
          changes.push({
            type: TRANSACTION_TYPES.ADD_PRIMARY_KEY,
            priority: 60,
            tableName,
            fieldName: currentField.name
          });
        } else {
          changes.push({
            type: TRANSACTION_TYPES.DROP_PRIMARY_KEY,
            priority: 80,
            tableName,
            fieldName: originalField.name
          });
        }
      }
      
      return changes;
    }
  
    _detectRelationChanges(originalRelations, currentRelations) {
      const changes = [];
      
      // Create maps using composite keys for relations without persistent IDs
      const createRelationKey = (rel) => 
        `${rel.fromTable}.${rel.fromField}->${rel.toTable}.${rel.toField}`;
      
      const originalMap = new Map(originalRelations.map(r => [createRelationKey(r), r]));
      const currentMap = new Map(currentRelations.map(r => [createRelationKey(r), r]));
      
      // Find dropped relations
      for (const [key, relation] of originalMap) {
        if (!currentMap.has(key)) {
          changes.push({
            type: TRANSACTION_TYPES.DROP_RELATION,
            priority: 85,
            relationKey: key,
            fromTable: relation.fromTable,
            fromField: relation.fromField,
            toTable: relation.toTable,
            toField: relation.toField
          });
        }
      }
      
      // Find new relations
      for (const [key, relation] of currentMap) {
        if (!originalMap.has(key)) {
          changes.push({
            type: TRANSACTION_TYPES.ADD_RELATION,
            priority: 70,
            relationKey: key,
            fromTable: relation.fromTable,
            fromField: relation.fromField,
            toTable: relation.toTable,
            toField: relation.toField
          });
        }
      }
      
      return changes;
    }
  
    _optimizeChanges(changes) {
      // Group related changes and optimize execution order
      const optimized = [];
      const changeGroups = this._groupRelatedChanges(changes);
      
      for (const group of changeGroups) {
        if (this._shouldUseTableRecreation(group)) {
          optimized.push(this._createTableRecreationChange(group));
        } else {
          optimized.push(...group);
        }
      }
      
      return this._sortChangesByPriority(optimized);
    }
  
    _groupRelatedChanges(changes) {
      const groups = [];
      const changesByTable = new Map();
      
      // Group changes by table
      for (const change of changes) {
        const tableName = change.tableName || change.newName || change.oldName;
        if (!tableName) {
          groups.push([change]); // Non-table changes go in their own group
          continue;
        }
        
        if (!changesByTable.has(tableName)) {
          changesByTable.set(tableName, []);
        }
        changesByTable.get(tableName).push(change);
      }
      
      // Add table groups to results
      for (const tableChanges of changesByTable.values()) {
        groups.push(tableChanges);
      }
      
      return groups;
    }
  
    _shouldUseTableRecreation(changes) {
      // Use table recreation for complex changes that are easier to handle that way
      return changes.some(change => 
        change.metadata?.requiresTableRecreation ||
        (changes.length > 5 && changes.some(c => c.type === TRANSACTION_TYPES.CHANGE_FIELD_TYPE))
      );
    }
  
    _createTableRecreationChange(changes) {
      const tableName = changes[0].tableName || changes[0].newName || changes[0].oldName;
      
      return {
        type: TRANSACTION_TYPES.RECREATE_TABLE,
        priority: 5,
        tableName,
        changes,
        metadata: {
          reason: 'Complex changes require table recreation',
          originalChanges: changes.length
        }
      };
    }
  
    _sortChangesByPriority(changes) {
      return changes.sort((a, b) => a.priority - b.priority);
    }
  
    _getFullType(field) {
      if (field.length && ['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(field.type)) {
        return `${field.type}(${field.length})`;
      }
      return field.type;
    }
  
    _isDataLossyChange(oldType, newType) {
      const lossyChanges = [
        ['TEXT', 'VARCHAR'],
        ['BIGINT', 'INTEGER'],
        ['BIGINT', 'SMALLINT'],
        ['INTEGER', 'SMALLINT'],
        ['DOUBLE PRECISION', 'REAL'],
        ['TIMESTAMP', 'DATE'],
        ['TIMESTAMP', 'TIME']
      ];
      
      return lossyChanges.some(([from, to]) => 
        oldType.startsWith(from) && newType.startsWith(to)
      );
    }
  
    _requiresTableRecreation(originalField, currentField) {
      // Some changes require table recreation in certain databases (like SQLite)
      return (
        originalField.primaryKey !== currentField.primaryKey ||
        (originalField.type !== currentField.type && 
         ['INTEGER', 'REAL', 'TEXT', 'BLOB'].includes(originalField.type))
      );
    }
  
    _getAffectedRelations(tableName, relations) {
      return relations.filter(r => 
        r.fromTable === tableName || r.toTable === tableName
      ).length;
    }
  }
  
  // Enhanced validator with better error detection
  export class TransactionValidator {
    static validate(transactions) {
      const errors = [];
      const warnings = [];
      
      // Check for logical conflicts
      this._validateTableOperations(transactions, errors, warnings);
      this._validateFieldOperations(transactions, errors, warnings);
      this._validateRelationOperations(transactions, errors, warnings);
      this._validateDataIntegrity(transactions, errors, warnings);
      
      return { 
        isValid: errors.length === 0, 
        errors, 
        warnings,
        riskLevel: this._calculateRiskLevel(transactions, warnings)
      };
    }
  
    static _validateTableOperations(transactions, errors, warnings) {
      const tableOps = transactions.filter(t => 
        [TRANSACTION_TYPES.CREATE_TABLE, TRANSACTION_TYPES.DROP_TABLE, TRANSACTION_TYPES.RENAME_TABLE]
          .includes(t.type)
      );
      
      const tableNames = new Set();
      
      for (const op of tableOps) {
        const name = op.tableName || op.newName;
        if (tableNames.has(name)) {
          errors.push(`Duplicate operations on table: ${name}`);
        }
        tableNames.add(name);
        
        if (op.type === TRANSACTION_TYPES.DROP_TABLE && op.metadata?.hasData) {
          warnings.push(`Dropping table '${op.tableName}' will result in data loss`);
        }
      }
    }
  
    static _validateFieldOperations(transactions, errors, warnings) {
      const fieldOps = transactions.filter(t => 
        t.type && t.type.includes('FIELD')
      );
      
      for (const op of fieldOps) {
        if (op.metadata?.potentialDataLoss) {
          warnings.push(`Field type change may cause data loss: ${op.tableName}.${op.fieldName}`);
        }
        
        if (op.metadata?.requiresValidation) {
          warnings.push(`Making field non-nullable requires data validation: ${op.tableName}.${op.fieldName}`);
        }
      }
    }
  
    static _validateRelationOperations(transactions, errors, warnings) {
      // Check if relations reference existing tables and fields
      const relationOps = transactions.filter(t => 
        [TRANSACTION_TYPES.ADD_RELATION, TRANSACTION_TYPES.DROP_RELATION].includes(t.type)
      );
      
      for (const op of relationOps) {
        if (op.type === TRANSACTION_TYPES.DROP_RELATION) {
          warnings.push(`Dropping relation: ${op.fromTable}.${op.fromField} -> ${op.toTable}.${op.toField}`);
        }
      }
    }
  
    static _validateDataIntegrity(transactions, errors, warnings) {
      const recreateOps = transactions.filter(t => t.type === TRANSACTION_TYPES.RECREATE_TABLE);
      
      for (const op of recreateOps) {
        warnings.push(`Table recreation required for '${op.tableName}' - this will temporarily lock the table`);
      }
    }
  
    static _calculateRiskLevel(transactions, warnings) {
      let risk = 0;
      
      // High risk operations
      const highRiskOps = transactions.filter(t => 
        [TRANSACTION_TYPES.DROP_TABLE, TRANSACTION_TYPES.RECREATE_TABLE].includes(t.type)
      );
      risk += highRiskOps.length * 3;
      
      // Medium risk operations
      const mediumRiskOps = transactions.filter(t => 
        t.metadata?.potentialDataLoss || t.metadata?.requiresValidation
      );
      risk += mediumRiskOps.length * 2;
      
      // Warning count
      risk += warnings.length;
      
      if (risk === 0) return 'LOW';
      if (risk <= 3) return 'MEDIUM';
      return 'HIGH';
    }
  }
  
  // Main API
  export function createChangeDetector(options) {
    return new ChangeDetector(options);
  }
  
  export function detectDatabaseChanges(originalData, currentData, options = {}) {
    const detector = new ChangeDetector(options);
    const changes = detector.detectChanges(originalData, currentData);
    const validation = TransactionValidator.validate(changes);
    
    return {
      changes,
      validation,
      summary: {
        totalChanges: changes.length,
        riskLevel: validation.riskLevel,
        hasErrors: !validation.isValid,
        warningCount: validation.warnings.length
      }
    };
  }