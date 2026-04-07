import { useState } from "react";

const ImageWithPlaceholder = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      
      {/* Skeleton Placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-300"></div>
      )}

      {/* Image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Fallback */}
      {error && (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default ImageWithPlaceholder;