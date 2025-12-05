// hooks/usePreloader.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePreloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show preloader on route change
    setIsLoading(true);

    const checkImagesLoaded = () => {
      const images = document.getElementsByTagName('img');
      const totalImages = images.length;
      let loadedImages = 0;

      // If no images, proceed to hide preloader
      if (totalImages === 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); // Maintain your original 1-second delay
        return;
      }

      // Handle each image's load event
      const onImageLoad = () => {
        loadedImages += 1;
        if (loadedImages === totalImages) {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000); // Delay after all images are loaded
        }
      };

      // Handle image errors (e.g., broken images)
      const onImageError = () => {
        loadedImages += 1;
        if (loadedImages === totalImages) {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      };

      // Attach load and error listeners to each image
      Array.from(images).forEach((img) => {
        if (img.complete) {
          // If image is already loaded (cached)
          loadedImages += 1;
          if (loadedImages === totalImages) {
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }
        } else {
          img.addEventListener('load', onImageLoad);
          img.addEventListener('error', onImageError);
        }
      });

      // Cleanup listeners for images that haven't loaded yet
      return () => {
        Array.from(images).forEach((img) => {
          img.removeEventListener('load', onImageLoad);
          img.removeEventListener('error', onImageError);
        });
      };
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      checkImagesLoaded();
    } else {
      window.addEventListener('load', checkImagesLoaded);
      return () => {
        window.removeEventListener('load', checkImagesLoaded);
      };
    }
  }, [location.pathname, location.state, location.key]); // Watch for route changes

  return isLoading;
};

export default usePreloader;