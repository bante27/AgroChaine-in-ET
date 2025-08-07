import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default'
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  }

  return (
    <div className={`
      bg-white rounded-lg card-shadow
      ${hover ? 'hover:card-shadow-lg transition-shadow duration-300' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card