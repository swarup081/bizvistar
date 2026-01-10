import React from 'react';

const Logo = ({ className = '', ...props }) => {
  return (
    <div 
      className={`font-[family-name:var(--font-boiling)] text-black-600 ${className}`} 
      {...props}
    >
      <span className="md:hidden">B</span>
      <span className="tracking-wide hidden md:inline">BizVistar</span>
    </div>
  );
};

export default Logo;
