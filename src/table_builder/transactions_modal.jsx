// TransactionModal.js - Component to display pending transactions

import { X, Database, Plus, Minus, Edit, ArrowRight } from 'lucide-react';
import { TRANSACTION_TYPES } from './change_tracker';

function TransactionModal({ transactions, onClose, onSync }) {
  const getTransactionIcon = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.CREATE_TABLE:
      case TRANSACTION_TYPES.ADD_FIELD:
      case TRANSACTION_TYPES.ADD_RELATION:
      case TRANSACTION_TYPES.ADD_PRIMARY_KEY:
        return <Plus size={16} className="text-green-600" />;
      case TRANSACTION_TYPES.DROP_TABLE:
      case TRANSACTION_TYPES.DROP_FIELD:
      case TRANSACTION_TYPES.DROP_RELATION:
      case TRANSACTION_TYPES.DROP_PRIMARY_KEY:
        return <Minus size={16} className="text-red-600" />;
      default:
        return <Edit size={16} className="text-blue-600" />;
    }
  };

  const getTransactionDescription = (transaction) => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.CREATE_TABLE:
        return `Create table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.DROP_TABLE:
        return `Drop table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.RENAME_TABLE:
        return `Rename table "${transaction.oldName}" to "${transaction.newName}"`;
      case TRANSACTION_TYPES.ADD_FIELD:
        return `Add field "${transaction.field.name}" (${transaction.field.type}) to table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.DROP_FIELD:
        return `Drop field "${transaction.fieldName}" from table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.RENAME_FIELD:
        return `Rename field "${transaction.oldName}" to "${transaction.newName}" in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.CHANGE_FIELD_TYPE:
        return `Change field "${transaction.fieldName}" type from ${transaction.oldType} to ${transaction.newType} in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.CHANGE_FIELD_LENGTH:
        return `Change field "${transaction.fieldName}" length from ${transaction.oldLength || 'unset'} to ${transaction.newLength || 'unset'} in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.CHANGE_FIELD_NULLABLE:
        return `Change field "${transaction.fieldName}" nullable from ${transaction.oldNullable} to ${transaction.newNullable} in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.CHANGE_FIELD_DEFAULT:
        return `Change field "${transaction.fieldName}" default value from "${transaction.oldDefault || 'none'}" to "${transaction.newDefault || 'none'}" in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.ADD_PRIMARY_KEY:
        return `Add primary key constraint to field "${transaction.fieldName}" in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.DROP_PRIMARY_KEY:
        return `Remove primary key constraint from field "${transaction.fieldName}" in table "${transaction.tableName}"`;
      case TRANSACTION_TYPES.ADD_RELATION:
        return `Add relation from ${transaction.fromTable}.${transaction.fromField} to ${transaction.toTable}.${transaction.toField}`;
      case TRANSACTION_TYPES.DROP_RELATION:
        return `Drop relation from ${transaction.fromTable}.${transaction.fromField} to ${transaction.toTable}.${transaction.toField}`;
      default:
        return 'Unknown transaction';
    }
  };

  const groupTransactionsByTable = (transactions) => {
    const groups = {};
    transactions.forEach(transaction => {
      const key = transaction.tableName || 'Relations';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(transaction);
    });
    return groups;
  };

  const groupedTransactions = groupTransactionsByTable(transactions);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pending Changes</h2>
            <p className="text-sm text-gray-500 mt-1">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} ready to sync
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Database size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No changes detected</p>
              <p className="text-gray-400 text-sm mt-2">
                Make some changes to your tables and fields to see transactions here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([tableName, tableTransactions]) => (
                <div key={tableName} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Database size={16} />
                      {tableName}
                      <span className="text-sm text-gray-500 font-normal">
                        ({tableTransactions.length} change{tableTransactions.length !== 1 ? 's' : ''})
                      </span>
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {tableTransactions.map((transaction, index) => (
                      <div key={transaction.id} className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              {getTransactionDescription(transaction)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Type: {transaction.type.replace(/_/g, ' ').toLowerCase()}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              These changes will be applied to your PostgreSQL database.
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSync();
                  onClose();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <ArrowRight size={16} />
                Sync to Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionModal;