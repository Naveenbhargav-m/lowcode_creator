const MobileMockup = ({ children }) => {
    return (
      <div
        className="flex flex-col justify-center items-center h-5/6 w-2/6 border border-4 border-black rounded-lg m-2 overflow-hidden"
        style={{minWidth:"300px", minHeight:"600px"}}
      >
        <div className="h-full w-full overflow-auto scrollbar-hide">
          {children}
        </div>
        
      </div>
    );
  };
  

  export default MobileMockup;