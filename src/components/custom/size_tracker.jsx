import { useEffect, useRef } from "preact/hooks";

const ResizeTracker = ({ children, callback }) => {
    const elementRef = useRef(null);
  
    useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          callback(width, height);
        }
      });
  
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
  
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);
  
    return (
      <div ref={elementRef} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    );
  };
  

  export default ResizeTracker;
