import classNames from "classnames";
import { useState } from "react";

export function Avatar({ src, alt, fallback, className }) {
  const [error, setError] = useState(false);

  return (
    <div className={classNames("relative rounded-full overflow-hidden", className)}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600">
          {fallback}
        </div>
      )}
    </div>
  );
}