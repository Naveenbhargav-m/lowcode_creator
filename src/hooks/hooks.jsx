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

export default useElementDimensions;
