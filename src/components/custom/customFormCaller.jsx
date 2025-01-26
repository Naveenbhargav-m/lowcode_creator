import React from "react";
import DynamicForm from "./custom_form";

const formConfig = {
  fields: {
    firstName: {
      type: "text",
      label: "First Name:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "bold", fontSize: "16px", color: "black" },
      layout: { x: 0, y: 0, w: 2, h: 1 },
    },
    age: {
      type: "number",
      label: "Age:",
      defaultValue: 0,
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "bold", fontSize: "16px", color: "black" },
      calculations: {
        formula: "values.firstName.length * 2",
      },
      layout: { x: 2, y: 0, w: 2, h: 1 },
    },
    gender: {
      type: "dropdown",
      label: "Gender:",
      options: ["Male", "Female", "Other"],
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "bold", fontSize: "16px" },
      layout: { x: 0, y: 1, w: 2, h: 1 },
    },
    adultConfirmation: {
      type: "checkbox-single",
      label: "Are you over 18?",
      labelPosition: "top",
      labelSpacing: "10px",
      labelStyle: { fontWeight: "normal", fontSize: "14px", display: "block" },
      layout: { x: 2, y: 1, w: 2, h: 1 },
    },
    newsletter: {
      type: "radio-group",
      label: "Would you like to receive our newsletter?",
      options: ["Yes", "No"],
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "24px" },
      layout: { x: 0, y: 2, w: 4, h: 1 },
    },
    preferredContact: {
      type: "button-group",
      label: "Preferred Contact Method:",
      options: ["Email", "Phone", "Mail"],
      defaultValue: "Email",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
      layout: { x: 0, y: 3, w: 4, h: 1 },
    },
    notifications: {
      type: "switch",
      label: "Enable Notifications:",
      defaultValue: true,
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
      layout: { x: 0, y: 4, w: 2, h: 1 },
    },
    appointmentDateTime: {
      type: "date-time",
      label: "Appointment Date and Time:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    birthday: {
      type: "date",
      label: "Birthday:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    birthMonth: {
      type: "month",
      label: "Birth Month:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    graduationYear: {
      type: "year",
      label: "Graduation Year:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    meetingWeek: {
      type: "week",
      label: "Meeting Week:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    website: {
      type: "url",
      label: "Website:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    contactNumber: {
      type: "phone",
      label: "Phone Number:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    location: {
      type: "location",
      label: "Location (Longitude & Latitude):",
      defaultValue: { longitude: "", latitude: "" },
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    experience: {
      type: "slider",
      label: "Experience Level:",
      min: 0,
      max: 10,
      defaultValue: 5,
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    emailAddress: {
      type: "email",
      label: "Email Address:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    password: {
      type: "password",
      label: "Password:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    lunchTime: {
      type: "time",
      label: "Preferred Lunch Time:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    bio: {
      type: "long-text",
      label: "Bio:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    tags: {
      type: "tags",
      label: "Tags:",
      defaultValue: [""],
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
      options: ["tag1", "tag2"],
    },
    resume: {
      type: "file",
      label: "Upload Resume:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
    profilePicture: {
      type: "image",
      label: "Upload Profile Picture:",
      defaultValue: "",
      labelPosition: "top",
      labelSpacing: "8px",
      labelStyle: { fontWeight: "normal", fontSize: "14px" },
    },
  },
  conditions: [
    {
      if: {
        field: "age",
        operator: ">=",
        value: 18,
      },
      then: {
        field: "adultConfirmation",
        value: true,
      },
    },
  ],
};

const DynamicFormCaller = () => {
  const handleSubmit = (formData) => {
    console.log("Form submitted with values:", formData);
  };

  return (
    <div>
      <DynamicForm
        config={formConfig}
        values={{ firstName: "John", age: 10, gender: "Male" }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};


const GridFormCaller = () => {
  const handleSubmit = (formData) => {
    console.log("Form submitted with values:", formData);
  };

  return (
    <div>
      <DynamicForm
        config={formConfig}
        values={{ firstName: "John", age: 10, gender: "Male" }}
        onSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
};
export {GridFormCaller , DynamicFormCaller};

// onClick={() => handleChange(fieldName, option)}
