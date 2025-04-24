import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  className = '',
  elevation = 'md',
  padding = 'md',
  rounded = 'md',
  bordered = false,
  hoverEffect = false,
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-white dark:bg-secondary-800 transition-all';
  
  // Elevation classes
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };
  
  // Border classes
  const borderClasses = bordered 
    ? 'border border-secondary-200 dark:border-secondary-700' 
    : '';
  
  // Hover effect classes
  const hoverClasses = hoverEffect 
    ? 'hover:shadow-lg hover:translate-y-[-2px]' 
    : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${elevationClasses[elevation]}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        ${borderClasses}
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  elevation: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  bordered: PropTypes.bool,
  hoverEffect: PropTypes.bool
};

export default Card;
