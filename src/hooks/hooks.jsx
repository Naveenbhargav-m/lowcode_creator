import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

const useElementDimensions = (ref) => {
  const width = useSignal(0);
  const height = useSignal(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        width.value = rect.width;
        height.value = rect.height;
      }
    };

    // Initial dimension update
    updateDimensions();

    // Update dimensions on window resize
    window.addEventListener('resize', updateDimensions);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [ref]); // Dependency on the ref

  return { width, height };
};


// useAuthCheck.js
import { useLocation } from "preact-iso";
import { AppID } from "../states/global_state"; // Adjust the import path as needed

export function useAuthCheck(options = {}) {
  const {
    redirectPath = "/",
    replace = true,
    dependencies = []
  } = options;
  
  const location = useLocation();
  
  useEffect(() => {
    if (AppID.value.length === 0) {
      console.log("No AppID found, redirecting to", redirectPath);
      location.route(redirectPath, replace);
    }
  }, [AppID.value, redirectPath, replace, ...dependencies]);
}

export {useElementDimensions};
