function generateRandomName(startText, length = 5) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < length; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `${startText}${randomPart}`;
}


function generateUID(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uid += characters[randomIndex];
    }
    return uid;
}

const getSortedFields = (elementsObject) => {
    if(elementsObject === undefined || elementsObject === null) {
        return [];
    }
    return Object.entries(elementsObject)
      .sort((a, b) => a[1].order - b[1].order) // Sort by order
      .map(([key, value]) => ({ key, ...value })); // Convert back to array format
  };
  

export {generateRandomName, generateUID, getSortedFields};