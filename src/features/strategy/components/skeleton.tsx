import React, { memo } from "react";

const StrategySkeleton = () => {
  return (
    <div className="flex flex-col p-6 space-y-5 h-full">
      <div className="flex w-full justify-between">
        <div className="bg-gray-200 dark:bg-gray-800 animate-pulse w-[280px] h-[40px] rounded-md"></div>
      </div>
      <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-[280px] mx-2 my-2 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default memo(StrategySkeleton);
