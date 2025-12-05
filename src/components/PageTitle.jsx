import React from 'react';
import Breadcrumb from './Breadcrumb';

const PageTitle = ({ 
  title,
  containerClassName = "lg:mt-50 mt-30",
  showBreadcrumb = true
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Dynamic Breadcrumb */}
      {showBreadcrumb && (
        <Breadcrumb className="justify-center xl:justify-start" />
      )}
      
      {/* Title with vertical line */}
      <div className="flex items-center justify-center xl:justify-start gap-4">
        <h1 className="text-center xl:text-left lg:text-6xl md:text-5xl text-4xl font-bold">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PageTitle;
