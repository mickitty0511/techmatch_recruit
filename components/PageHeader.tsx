import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  bgColor?: string;
  textColor?: string;
  descriptionColor?: string;
  borderColor?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  bgColor,
  textColor,
  descriptionColor,
  borderColor
}) => {
  return (
    <div className={`px-6 py-4 ${bgColor} border-b ${borderColor}`}>
      <h1 className={`text-xl font-semibold ${textColor} text-center`}>{title}</h1>
      <p className={`text-sm ${descriptionColor} mb-6 text-center mt-5`}>{description}</p>
    </div>
  );
};

export default PageHeader;