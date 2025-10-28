import React from "react";

const LayoutSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-12">
      <div className="bg-gray-200 dark:bg-gray-800 animate-pulse w-full md:min-h-[200px] lg:min-h-[200px] xl:min-h-[650px] rounded-md" />
      <div className="bg-gray-200 dark:bg-gray-800 animate-pulse w-full md:min-h-[200px] lg:min-h-[200px] xl:min-h-[650px] rounded-md" />
    </div>
  );
};

export default LayoutSkeleton;
