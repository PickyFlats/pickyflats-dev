import React from 'react';

export default function Loader({
  className,
  loaderClassName,
}: {
  className?: string;
  loaderClassName?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${loaderClassName} h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500`}
      ></div>
    </div>
  );
}
