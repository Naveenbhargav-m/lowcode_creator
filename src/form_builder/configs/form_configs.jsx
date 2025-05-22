
const textfield = {
    type: 'text',
    label: 'First Name',
    defaultValue: '',
    validation: [],
    validateOn: [],
    actions: [],
    style: {},
    props: {placeholder: "First Name"},
    hidden: { },
    options: [],
    children: []
};

const select = {
    type: 'text',
    label: 'First Name',
    defaultValue: '',
    validation: [],
    validateOn: [],
    actions: [],
    style: {},
    props: {placeholder: "pick 1"},
    hidden: { },
    options: [{"label": "option1", "value": "option1"}, {"label": "option2", "value":"option2"}],
    children: []
};

const checkbox = {
    id: 'hasMailingAddress',
    type: 'checkbox',
    label: 'Mailing address is different from residential address',
    defaultValue: false,
    actions:{}
};

const date = {
    id: 'date',
    type: 'date',
    label: 'Pick a date',
    defaultValue: false,
    actions:{}
};

const fieldConfigs = {
    "textfield": {...textfield},
    "checkbox": {...checkbox},
    "textarea": {...textfield},
    "dropdown": {...select},
    "date": {...date},
};





export {fieldConfigs}