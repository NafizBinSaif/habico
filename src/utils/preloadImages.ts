// This file contains the utility function for preloading the rock images.

const rockImagePaths = Array.from({ length: 10 }, (_, i) => `/images/rock/${i}.png`);

/**
 * Preloads the set of rock images by creating new Image objects.
 * This prompts the browser to fetch and cache the images in the background
 * without displaying them, ensuring they are ready for instant display later.
 */
export const preloadRockImages = (): void => {
  rockImagePaths.forEach((path) => {
    const img = new Image();
    img.src = path;
  });
};
