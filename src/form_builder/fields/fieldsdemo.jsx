import { useState } from "react";
import {
  TextField,
  TextArea,
  Checkbox,
  Select,
  RangeSlider,
  Rating,
  DatePicker,
  RadioGroup,
  ColorField,
  Toggle,
  GridField,
  SubForm,
  ArrayList,
  DateTimePicker,
  TimePicker,
  MonthPicker,
  WeekPicker,
  DayPicker
} from "./fields_v2";

export function ComplexFormComponentsDemo() {
  const [formData, setFormData] = useState({
    // Grid data
    employees: [
      { id: "1", name: "John Doe", position: "Developer", department: "Engineering" },
      { id: "2", name: "Jane Smith", position: "Designer", department: "Product" }
    ],
    
    // SubForm data
    contactInfo: {
      address: "123 Main St",
      city: "San Francisco",
      zipCode: "94105"
    },
    
    // ArrayList data
    skills: ["JavaScript", "React", "Node.js"],
    
    // Date fields
    startDate: "2025-04-23",
    meeting: "2025-04-23T10:30",
    dailyStart: "09:00",
    fiscalMonth: "2025-04",
    sprintWeek: "2025-W17",
    weekday: "Monday"
  });

  // Generic handler for all form fields
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Complex Form Components</h1>
      
      {/* GridField Demo */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Employee Directory (GridField)</h2>
        <GridField
          config={{
            label: "Employee Directory",
            value: formData.employees,
            columns: [
              { field: "id", header: "ID" },
              { field: "name", header: "Name" },
              { field: "position", header: "Position" },
              { field: "department", header: "Department" }
            ],
            addButtonText: "Add Employee"
          }}
          onAction={(e, action, value) => {
            if (action === "onChange") {
              handleFieldChange("employees", value);
            }
          }}
        />
      </div>
      
      {/* SubForm Demo */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Contact Information (SubForm)</h2>
        <SubForm
          config={{
            label: "Contact Information",
            name: "contactInfo",
            value: formData.contactInfo,
            fields: [
              { 
                type: "text",
                name: "address",
                label: "Street Address",
                placeholder: "Enter street address"
              },
              { 
                type: "text",
                name: "city",
                label: "City",
                placeholder: "Enter city" 
              },
              { 
                type: "text",
                name: "zipCode",
                label: "ZIP Code",
                placeholder: "Enter ZIP code"
              }
            ]
          }}
          onAction={(e, action, value) => {
            if (action === "onChange") {
              handleFieldChange("contactInfo", value);
            }
          }}
        />
      </div>
      
      {/* ArrayList Demo */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Skills (ArrayList)</h2>
        <ArrayList
          config={{
            label: "Skills",
            value: formData.skills,
            defaultItem: "New Skill",
            addButtonText: "Add Skill"
          }}
          onAction={(e, action, value) => {
            if (action === "onChange") {
              handleFieldChange("skills", value);
            }
          }}
        />
      </div>
      
      {/* Date Components */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Date & Time Components</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <DatePicker
            config={{
              label: "Start Date",
              value: formData.startDate
            }}
            onAction={(e, action, value) => {
              if (action === "onChange") {
                handleFieldChange("startDate", value);
              }
            }}
          />
          
          <DateTimePicker
            config={{
              label: "Meeting Date & Time",
              value: formData.meeting
            }}
            onAction={(e, action, value) => {
              if (action === "onChange") {
                handleFieldChange("meeting", value);
              }
            }}
          />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <TimePicker
            config={{
              label: "Daily Start Time",
              value: formData.dailyStart
            }}
            onAction={(e, action, value) => {
              if (action === "onChange") {
                handleFieldChange("dailyStart", value);
              }
            }}
          />
          
          <MonthPicker
            config={{
              label: "Fiscal Month",
              value: formData.fiscalMonth
            }}
            onAction={(e, action, value) => {
              if (action === "onChange") {
                handleFieldChange("fiscalMonth", value);
              }
            }}
          />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <WeekPicker
            config={{
              label: "Sprint Week",
              value: formData.sprintWeek
            }}
            onAction={(e, action, value) => {
              if (action === "onChange") {
                handleFieldChange("sprintWeek", value);
              }
            }}
          />
          
          <DayPicker
            config={{
              label: "Preferred Weekday",
              value: formData.weekday,
              layout: "vertical",
              shortNames: true
            }}
            onAction={(e, action, value) => {
              if (action === "onChange") {
                handleFieldChange("weekday", value);
              }
            }}
          />
        </div>
      </div>
      
      {/* Form Data (For demonstration) */}
      <div>
        <h2>Current Form Data</h2>
        <pre style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "15px", 
          borderRadius: "5px",
          overflow: "auto",
          maxHeight: "300px" 
        }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function DynamicFormDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    agreeToTerms: false,
    favoriteColor: "#4f46e5",
    experience: 0,
    rating: 0,
    startDate: "",
    notificationType: "",
    darkMode: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleAction = (field) => (e, action, value) => {
    if (action === "onChange") {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dynamic Form Demo</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-sm text-blue-800">
            This form demonstrates various form components from our dynamic form creator.
            Try interacting with the different elements to see how they work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <TextField
              config={{
                label: "Full Name",
                placeholder: "Enter your name",
                value: formData.name,
                fieldStyle: { borderColor: formData.name ? "#4f46e5" : "#cbd5e1" }
              }}
              onAction={handleAction("name")}
            />
          </div>
          
          <div>
            <TextField
              config={{
                label: "Email Address",
                placeholder: "your@email.com",
                value: formData.email,
                fieldStyle: { borderColor: formData.email ? "#4f46e5" : "#cbd5e1" }
              }}
              onAction={handleAction("email")}
            />
          </div>
        </div>
        
        <div>
          <TextArea
            config={{
              label: "Description",
              placeholder: "Tell us about yourself",
              value: formData.description,
              rows: 3
            }}
            onAction={handleAction("description")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <ColorField
            config={{
              label: "Favorite Color",
              value: formData.favoriteColor
            }}
            onAction={handleAction("favoriteColor")}
          />
          
          <div className="ml-4">
            <div 
              className="w-12 h-12 rounded-md border border-gray-300" 
              style={{ backgroundColor: formData.favoriteColor }}
            />
          </div>
        </div>
        
        <div>
          <RangeSlider
            config={{
              label: "Years of Experience",
              min: 0,
              max: 20,
              step: 1,
              value: formData.experience,
              showValue: true,
              showMinValue: true,
              showMaxValue: true
            }}
            onAction={handleAction("experience")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <DatePicker
              config={{
                label: "Start Date",
                value: formData.startDate
              }}
              onAction={handleAction("startDate")}
            />
          </div>
          
          <div className="ml-4 flex-1">
            <Rating
              config={{
                label: "How would you rate us?",
                value: formData.rating,
                totalStars: 5
              }}
              onAction={handleAction("rating")}
            />
          </div>
        </div>
        
        <div>
          <RadioGroup
            config={{
              label: "Notification Preference",
              layout: "horizontal",
              value: formData.notificationType,
              options: [
                { label: "Email", value: "email" },
                { label: "SMS", value: "sms" },
                { label: "Push", value: "push" }
              ]
            }}
            onAction={handleAction("notificationType")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Toggle
            config={{
              label: "Dark Mode",
              checked: formData.darkMode
            }}
            onAction={handleAction("darkMode")}
          />
          
          <Checkbox
            config={{
              label: "I agree to terms and conditions",
              checked: formData.agreeToTerms
            }}
            onAction={handleAction("agreeToTerms")}
          />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={() => setFormData({
              name: "",
              email: "",
              description: "",
              agreeToTerms: false,
              favoriteColor: "#4f46e5",
              experience: 0,
              rating: 0,
              startDate: "",
              notificationType: "",
              darkMode: false
            })}
          >
            Reset
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!formData.name || !formData.email || !formData.agreeToTerms}
          >
            Submit
          </button>
        </div>
      </form>
      
      {submitted && (
        <div className="mt-8 p-4 bg-green-50 rounded-md">
          <h2 className="text-lg font-semibold text-green-800">Form Submitted!</h2>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}