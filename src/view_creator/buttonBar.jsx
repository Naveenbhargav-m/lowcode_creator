function TablesButtonsBar({configs}) {
    let buttons = configs["buttons"] || [];
    let callBacks = configs["callbacks"];
    return (
      <div className="flex bg-white justify-end p-4" style={{fontSize:"0.8em"}}>
        {buttons.map((text, ind) => {
              return (<button
              style={{fontSize:"0.9em"}}
              onClick={() => callBacks[ind]()}
              className="bg-secondary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary"
            >
              <p>{text}</p>
            </button>);
        })}
    </div>
    );
  } 

  export {TablesButtonsBar};