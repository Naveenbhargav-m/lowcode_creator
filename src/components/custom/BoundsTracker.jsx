import { useEffect, useRef } from "preact/hooks";

const BoundsTracker = ({ children, callback }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const bounds = {
          xStart: rect.left,
          xEnd: rect.right,
          yStart: rect.top,
          yEnd: rect.bottom,
        };
        callback(bounds);
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
  }, [callback]);

  return (
    <div ref={elementRef} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};

export default BoundsTracker;
