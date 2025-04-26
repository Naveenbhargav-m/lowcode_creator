// Example configuration for a data processing workflow block

const workflowBlockConfig = {
    tabs: [
      {
        title: "General",
        sections: [
          {
            title: "Basic Settings",
            description: "Configure the basic properties of this workflow block",
            collapsed: false,
            fields: [
              {
                id: "blockName",
                type: "text",
                label: "Block Name",
                description: "Enter a unique name for this workflow block",
                placeholder: "My Workflow Block",
                required: true,
                defaultValue: "New Block",
                validate: (value) => {
                  if (value.length < 3) return "Name must be at least 3 characters";
                  return null;
                }
              },
              {
                id: "blockDescription",
                type: "text",
                label: "Description",
                description: "Provide a brief description of what this block does",
                placeholder: "This block processes data from...",
                defaultValue: ""
              },
              {
                id: "enabled",
                type: "toggle",
                label: "Enabled",
                description: "Enable or disable this workflow block",
                defaultValue: true
              },
              {
                id: "executionMode",
                type: "buttonGroup",
                label: "Execution Mode",
                description: "Select how this block should be executed",
                options: [
                  { value: "sync", label: "Synchronous" },
                  { value: "async", label: "Asynchronous" },
                  { value: "parallel", label: "Parallel" }
                ],
                defaultValue: "sync"
              }
            ]
          },
          {
            title: "Scheduling",
            description: "Configure when this block should run",
            collapsed: true,
            fields: [
              {
                id: "scheduleType",
                type: "select",
                label: "Schedule Type",
                description: "How often should this block run?",
                options: [
                  { value: "manual", label: "Manual Trigger Only" },
                  { value: "interval", label: "Fixed Interval" },
                  { value: "cron", label: "Custom Schedule (Cron)" },
                  { value: "event", label: "On Event" }
                ],
                defaultValue: "manual"
              },
              {
                id: "interval",
                type: "select",
                label: "Interval",
                description: "How frequently should this block run?",
                options: [
                  { value: "1m", label: "Every minute" },
                  { value: "5m", label: "Every 5 minutes" },
                  { value: "15m", label: "Every 15 minutes" },
                  { value: "30m", label: "Every 30 minutes" },
                  { value: "1h", label: "Every hour" },
                  { value: "6h", label: "Every 6 hours" },
                  { value: "12h", label: "Every 12 hours" },
                  { value: "24h", label: "Every 24 hours" }
                ],
                defaultValue: "1h",
                visible: (values) => values.scheduleType === "interval"
              },
              {
                id: "cronExpression",
                type: "text",
                label: "Cron Expression",
                description: "Enter a valid cron expression (e.g., '0 */2 * * *' for every 2 hours)",
                placeholder: "0 */2 * * *",
                defaultValue: "0 */2 * * *",
                visible: (values) => values.scheduleType === "cron",
                validate: (value) => {
                  // Simple validation for cron expression
                  if (!value.match(/^(\S+\s+){4}\S+$/)) {
                    return "Invalid cron expression format";
                  }
                  return null;
                }
              },
              {
                id: "eventName",
                type: "text",
                label: "Event Name",
                description: "Enter the name of the event that triggers this block",
                placeholder: "data.processed",
                defaultValue: "",
                visible: (values) => values.scheduleType === "event"
              },
              {
                id: "activeSchedule",
                type: "schedule",
                label: "Active Schedule",
                description: "Define specific times when this block should be active",
                intervals: 60, // 1-hour intervals
                defaultValue: {
                  "Monday": {
                    "9:00": true,
                    "10:00": true,
                    "11:00": true,
                    "12:00": true,
                    "13:00": true,
                    "14:00": true,
                    "15:00": true,
                    "16:00": true,
                    "17:00": true,
                  },
                  "Tuesday": {
                    "9:00": true,
                    "10:00": true,
                    "11:00": true,
                    "12:00": true,
                    "13:00": true,
                    "14:00": true,
                    "15:00": true,
                    "16:00": true,
                    "17:00": true,
                  },
                  "Wednesday": {
                    "9:00": true,
                    "10:00": true,
                    "11:00": true,
                    "12:00": true,
                    "13:00": true,
                    "14:00": true,
                    "15:00": true,
                    "16:00": true,
                    "17:00": true,
                  },
                  "Thursday": {
                    "9:00": true,
                    "10:00": true,
                    "11:00": true,
                    "12:00": true,
                    "13:00": true,
                    "14:00": true,
                    "15:00": true,
                    "16:00": true,
                    "17:00": true,
                  },
                  "Friday": {
                    "9:00": true,
                    "10:00": true,
                    "11:00": true,
                    "12:00": true,
                    "13:00": true,
                    "14:00": true,
                    "15:00": true,
                    "16:00": true,
                    "17:00": true,
                  }
                },
                visible: (values) => values.scheduleType !== "manual"
              }
            ]
          }
        ]
      },
      {
        title: "Input/Output",
        sections: [
          {
            title: "Data Sources",
            description: "Configure the data sources for this workflow block",
            collapsed: false,
            fields: [
              {
                id: "inputType",
                type: "select",
                label: "Input Type",
                description: "Select the type of input data",
                options: [
                  { value: "file", label: "File" },
                  { value: "api", label: "API" },
                  { value: "database", label: "Database" },
                  { value: "stream", label: "Data Stream" }
                ],
                defaultValue: "file"
              },
              {
                id: "fileSettings",
                type: "object",
                label: "File Settings",
                visible: (values) => values.inputType === "file",
                fields: [
                  {
                    id: "filePath",
                    type: "text",
                    label: "File Path",
                    description: "Enter the path to the input file",
                    placeholder: "/data/input.csv",
                    required: true
                  },
                  {
                    id: "fileFormat",
                    type: "select",
                    label: "File Format",
                    description: "Select the format of the input file",
                    options: [
                      { value: "csv", label: "CSV" },
                      { value: "json", label: "JSON" },
                      { value: "xml", label: "XML" },
                      { value: "excel", label: "Excel" }
                    ],
                    defaultValue: "csv"
                  }
                ]
              },
              {
                id: "apiSettings",
                type: "object",
                label: "API Settings",
                visible: (values) => values.inputType === "api",
                fields: [
                  {
                    id: "endpoint",
                    type: "text",
                    label: "API Endpoint",
                    description: "Enter the API endpoint URL",
                    placeholder: "https://api.example.com/data",
                    required: true
                  },
                  {
                    id: "method",
                    type: "buttonGroup",
                    label: "HTTP Method",
                    options: [
                      { value: "GET", label: "GET" },
                      { value: "POST", label: "POST" },
                      { value: "PUT", label: "PUT" },
                      { value: "DELETE", label: "DELETE" }
                    ],
                    defaultValue: "GET"
                  },
                  {
                    id: "headers",
                    type: "array",
                    label: "Request Headers",
                    description: "Add headers to the API request",
                    itemType: "object",
                    itemConfig: {
                      fields: {
                        key: {
                          type: "text",
                          label: "Key",
                          required: true
                        },
                        value: {
                          type: "text",
                          label: "Value",
                          required: true
                        }
                      }
                    },
                    addLabel: "Add Header"
                  }
                ]
              },
              {
                id: "databaseSettings",
                type: "object",
                label: "Database Settings",
                visible: (values) => values.inputType === "database",
                fields: [
                  {
                    id: "connectionString",
                    type: "text",
                    label: "Connection String",
                    description: "Enter the database connection string",
                    placeholder: "postgres://user:password@localhost:5432/db",
                    required: true
                  },
                  {
                    id: "query",
                    type: "text",
                    label: "SQL Query",
                    description: "Enter the SQL query to fetch data",
                    placeholder: "SELECT * FROM table WHERE condition",
                    required: true
                  }
                ]
              },
              {
                id: "streamSettings",
                type: "object",
                label: "Stream Settings",
                visible: (values) => values.inputType === "stream",
                fields: [
                  {
                    id: "streamName",
                    type: "text",
                    label: "Stream Name",
                    description: "Enter the name of the data stream",
                    placeholder: "user-events",
                    required: true
                  },
                  {
                    id: "batchSize",
                    type: "number",
                    label: "Batch Size",
                    description: "Number of records to process in each batch",
                    defaultValue: 100,
                    min: 1,
                    max: 10000
                  }
                ]
              }
            ]
          },
          {
            title: "Data Output",
            description: "Configure where the processed data should be sent",
            collapsed: true,
            fields: [
              {
                id: "outputType",
                type: "select",
                label: "Output Type",
                description: "Select the type of output",
                options: [
                  { value: "file", label: "File" },
                  { value: "api", label: "API" },
                  { value: "database", label: "Database" },
                  { value: "stream", label: "Data Stream" },
                  { value: "email", label: "Email" }
                ],
                defaultValue: "file"
              },
              {
                id: "outputFileSettings",
                type: "object",
                label: "File Output Settings",
                visible: (values) => values.outputType === "file",
                fields: [
                  {
                    id: "outputPath",
                    type: "text",
                    label: "Output Path",
                    description: "Enter the path where the output file should be saved",
                    placeholder: "/data/output.csv",
                    required: true
                  },
                  {
                    id: "outputFormat",
                    type: "select",
                    label: "Output Format",
                    description: "Select the format of the output file",
                    options: [
                      { value: "csv", label: "CSV" },
                      { value: "json", label: "JSON" },
                      { value: "xml", label: "XML" },
                      { value: "excel", label: "Excel" }
                    ],
                    defaultValue: "csv"
                  },
                  {
                    id: "appendToFile",
                    type: "toggle",
                    label: "Append to Existing File",
                    description: "If checked, output will be appended to existing file",
                    defaultValue: false
                  }
                ]
              },
              {
                id: "emailSettings",
                type: "object",
                label: "Email Settings",
                visible: (values) => values.outputType === "email",
                fields: [
                  {
                    id: "recipients",
                    type: "array",
                    label: "Recipients",
                    description: "Add email addresses to send the output to",
                    itemType: "text",
                    addLabel: "Add Recipient"
                  },
                  {
                    id: "subject",
                    type: "text",
                    label: "Email Subject",
                    description: "Enter the subject of the email",
                    placeholder: "Workflow Block Output Report",
                    required: true
                  },
                  {
                    id: "includeAttachment",
                    type: "toggle",
                    label: "Include Data as Attachment",
                    description: "If checked, the output data will be included as an attachment",
                    defaultValue: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Processing",
        sections: [
          {
            title: "Data Transformation",
            description: "Configure how the data should be transformed",
            collapsed: false,
            fields: [
              {
                id: "transformationType",
                type: "select",
                label: "Transformation Type",
                description: "Select how the data should be transformed",
                options: [
                  { value: "none", label: "No Transformation" },
                  { value: "filter", label: "Filter Records" },
                  { value: "map", label: "Map Fields" },
                  { value: "aggregate", label: "Aggregate Data" },
                  { value: "custom", label: "Custom Script" }
                ],
                defaultValue: "none"
              },
              {
                id: "filterCondition",
                type: "text",
                label: "Filter Condition",
                description: "Enter a condition to filter records (e.g., 'value > 100')",
                placeholder: "field > value",
                visible: (values) => values.transformationType === "filter"
              },
              {
                id: "fieldMappings",
                type: "array",
                label: "Field Mappings",
                description: "Map input fields to output fields",
                visible: (values) => values.transformationType === "map",
                itemType: "object",
                itemConfig: {
                  fields: {
                    sourceField: {
                      type: "text",
                      label: "Source Field",
                      required: true
                    },
                    targetField: {
                      type: "text",
                      label: "Target Field",
                      required: true
                    },
                    transformation: {
                      type: "select",
                      label: "Transformation",
                      options: [
                        { value: "none", label: "None" },
                        { value: "uppercase", label: "To Uppercase" },
                        { value: "lowercase", label: "To Lowercase" },
                        { value: "round", label: "Round Number" },
                        { value: "date", label: "Format Date" }
                      ],
                      defaultValue: "none"
                    }
                  }
                },
                addLabel: "Add Mapping"
              },
              {
                id: "aggregationFields",
                type: "array",
                label: "Aggregation Fields",
                description: "Configure fields to aggregate",
                visible: (values) => values.transformationType === "aggregate",
                itemType: "object",
                itemConfig: {
                  fields: {
                    field: {
                      type: "text",
                      label: "Field",
                      required: true
                    },
                    aggregation: {
                      type: "select",
                      label: "Aggregation",
                      options: [
                        { value: "sum", label: "Sum" },
                        { value: "avg", label: "Average" },
                        { value: "min", label: "Minimum" },
                        { value: "max", label: "Maximum" },
                        { value: "count", label: "Count" }
                      ],
                      defaultValue: "sum"
                    },
                    groupBy: {
                      type: "text",
                      label: "Group By Field",
                      required: false
                    }
                  }
                },
                addLabel: "Add Aggregation"
              },
              {
                id: "customScript",
                type: "text",
                label: "Custom Script",
                description: "Enter a custom JavaScript function to transform the data",
                placeholder: "function transform(data) {\n  // Transform data here\n  return data;\n}",
                visible: (values) => values.transformationType === "custom",
                multiline: true,
                rows: 10
              }
            ]
          },
          {
            title: "Error Handling",
            description: "Configure how errors should be handled",
            collapsed: true,
            fields: [
              {
                id: "errorStrategy",
                type: "buttonGroup",
                label: "Error Strategy",
                description: "What should happen when an error occurs?",
                options: [
                  { value: "fail", label: "Fail Workflow" },
                  { value: "continue", label: "Continue Workflow" },
                  { value: "retry", label: "Retry Operation" }
                ],
                defaultValue: "fail"
              },
              {
                id: "maxRetries",
                type: "number",
                label: "Max Retries",
                description: "Maximum number of retry attempts",
                defaultValue: 3,
                min: 1,
                max: 10,
                visible: (values) => values.errorStrategy === "retry"
              },
              {
                id: "retryDelay",
                type: "number",
                label: "Retry Delay (seconds)",
                description: "Delay between retry attempts in seconds",
                defaultValue: 30,
                min: 1,
                max: 3600,
                visible: (values) => values.errorStrategy === "retry"
              },
              {
                id: "errorNotification",
                type: "toggle",
                label: "Send Error Notifications",
                description: "Send email notifications when errors occur",
                defaultValue: true
              },
              {
                id: "notificationEmails",
                type: "array",
                label: "Notification Emails",
                description: "Email addresses to notify when errors occur",
                itemType: "text",
                visible: (values) => values.errorNotification === true,
                addLabel: "Add Email"
              }
            ]
          }
        ]
      },
      {
        title: "Advanced",
        sections: [
          {
            title: "Performance",
            description: "Configure performance settings",
            collapsed: true,
            fields: [
              {
                id: "concurrency",
                type: "number",
                label: "Concurrency",
                description: "Number of concurrent operations",
                defaultValue: 1,
                min: 1,
                max: 100
              },
              {
                id: "timeout",
                type: "number",
                label: "Timeout (seconds)",
                description: "Maximum execution time in seconds",
                defaultValue: 300,
                min: 1,
                max: 3600
              },
              {
                id: "memoryLimit",
                type: "number",
                label: "Memory Limit (MB)",
                description: "Maximum memory usage in MB",
                defaultValue: 512,
                min: 128,
                max: 16384
              },
              {
                id: "logLevel",
                type: "select",
                label: "Log Level",
                description: "Detail level for logging",
                options: [
                  { value: "error", label: "Error" },
                  { value: "warn", label: "Warning" },
                  { value: "info", label: "Information" },
                  { value: "debug", label: "Debug" },
                  { value: "trace", label: "Trace" }
                ],
                defaultValue: "info"
              }
            ]
          },
          {
            title: "Dependencies",
            description: "Configure block dependencies",
            collapsed: true,
            fields: [
              {
                id: "dependencies",
                type: "array",
                label: "Block Dependencies",
                description: "Select blocks that must complete before this block runs",
                itemType: "text",
                addLabel: "Add Dependency"
              },
              {
                id: "environmentVariables",
                type: "array",
                label: "Environment Variables",
                description: "Add environment variables required by this block",
                itemType: "object",
                itemConfig: {
                  fields: {
                    name: {
                      type: "text",
                      label: "Name",
                      required: true
                    },
                    value: {
                      type: "text",
                      label: "Value",
                      required: true
                    },
                    secret: {
                      type: "toggle",
                      label: "Is Secret",
                      defaultValue: false
                    }
                  }
                },
                addLabel: "Add Environment Variable"
              }
            ]
          },
          {
            title: "Webhooks",
            description: "Configure webhooks for this block",
            collapsed: true,
            fields: [
              {
                id: "enableWebhooks",
                type: "toggle",
                label: "Enable Webhooks",
                description: "Send HTTP requests when specific events occur",
                defaultValue: false
              },
              {
                id: "webhooks",
                type: "array",
                label: "Webhook Configurations",
                description: "Configure webhook endpoints and events",
                visible: (values) => values.enableWebhooks === true,
                itemType: "object",
                itemConfig: {
                  fields: {
                    event: {
                      type: "select",
                      label: "Event",
                      options: [
                        { value: "start", label: "Block Start" },
                        { value: "complete", label: "Block Complete" },
                        { value: "error", label: "Block Error" }
                      ],
                      required: true
                    },
                    url: {
                      type: "text",
                      label: "Webhook URL",
                      required: true
                    },
                    method: {
                      type: "select",
                      label: "HTTP Method",
                      options: [
                        { value: "GET", label: "GET" },
                        { value: "POST", label: "POST" },
                        { value: "PUT", label: "PUT" }
                      ],
                      defaultValue: "POST"
                    },
                    includeData: {
                      type: "toggle",
                      label: "Include Block Data",
                      defaultValue: true
                    }
                  }
                },
                addLabel: "Add Webhook"
              }
            ]
          }
        ]
      }
    ]
  };
  
  export default workflowBlockConfig;