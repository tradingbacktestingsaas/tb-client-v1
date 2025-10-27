import React from "react";

const TableSkeleton = () => {
  return (
    <div className="flex flex-col p-6 space-y-5 h-full">
      <div className="bg-gray-200 dark:bg-gray-800 animate-pulse w-full h-[600px] rounded-md"></div>
    </div>
  );
};

export default TableSkeleton;
