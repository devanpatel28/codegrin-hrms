import React from "react";

const HeadingTitle = ({ word1, word2, className = "", direction = "col" }) => {
  return (
    <div
      className={`w-full flex ${className} text-center pointer-events-none ${
        direction == "row" ? "flex-row gap-1 lg:gap-3 justify-center" : "flex-col md:gap-2 lg:gap-2"
      }`}
    >
      <h1 className="text-2xl md:text-5xl lg:text-7xl pointer-events-none font-bold text-white">
        {word1}
      </h1>
      <h1 className="text-2xl pb-5 md:text-5xl lg:text-7xl pointer-events-none font-bold inline-block bg-gradient-to-b from-white from-20% to-primary to-50% bg-clip-text text-transparent">
        {word2}
      </h1>
    </div>
  );
};

export default HeadingTitle;
