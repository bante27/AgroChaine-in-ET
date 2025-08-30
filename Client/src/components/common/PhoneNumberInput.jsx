import React, { useState, useEffect } from 'react';
import Input from './Input.jsx';
import CountryFlag from 'react-country-flag';

const ETHIOPIA = { name: 'Ethiopia', code: 'ET', callingCode: '+251' };

const PhoneNumberInput = ({
  value = '',
  onChange,
  label = 'Phone Number',
  required = false,
  disabled = false,
  name = 'phoneNumber',
  error, // external error prop
  ...props
}) => {
  const [nationalNumber, setNationalNumber] = useState('');
  const [internalError, setInternalError] = useState('');

  useEffect(() => {
    if (value) {
      // Remove +251 if present
      setNationalNumber(value.replace(/^\+251/, ''));
      setInternalError('');
    }
  }, [value]);

  const handleChange = (e) => {
    const number = e.target.value;
    setNationalNumber(number);

    // Simple validation: only digits and length >= 9
    if (!/^\d*$/.test(number)) {
      setInternalError('Only numbers are allowed.');
      onChange?.('');
    } else if (number.length < 9) {
      setInternalError('Phone number is too short.');
      onChange?.('');
    } else {
      setInternalError('');
      onChange?.(`${ETHIOPIA.callingCode}${number}`);
    }
  };

  const displayError = error || internalError;

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center rounded-md shadow-sm border focus-within:ring-2 focus-within:ring-gray-1000 focus-within:border-gray-100">
        <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300 rounded-l-md">
          <CountryFlag
            countryCode={ETHIOPIA.code}
            svg
            style={{ width: '24px', height: '16px', marginRight: '6px' }}
          />
          <span className="text-gray-900">{ETHIOPIA.callingCode}</span>
        </div>
        <Input
          type="tel"
          id={name}
          name={name}
          value={nationalNumber}
          onChange={handleChange}
          disabled={disabled}
          placeholder="911234567"
          className="flex-1 rounded-none rounded-r-md"
          {...props}
        />
      </div>
      {displayError && (
        <p className="text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
