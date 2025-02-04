

const baseColor = {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '5px',
    backgroundColor:"blue",
    border: '1px solid #ccc',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

const TextField = {
    ...baseColor,
};

const DefaultStyles = {
    "textfield": TextField,
};

export {DefaultStyles};