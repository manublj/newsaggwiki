import React, { useState, useEffect, useRef } from 'react';
import { Form, Badge, Button, Dropdown } from 'react-bootstrap';
import { X, Plus } from 'react-bootstrap-icons';
import './NotionMultiSelect.css';

const NotionMultiSelect = ({ 
  options, 
  value, 
  onChange, 
  labelledBy,
  allowNew = true,
  placeholder = "Select options..."
}) => {
  const [selectedOptions, setSelectedOptions] = useState(value || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newOption, setNewOption] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialMount = useRef(true);

  // Update parent component when selections change, but only if it's not the initial mount
  // and only if the selections have actually changed
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Check if arrays are different before calling onChange
    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => 
        item.value === arr2[index].value && item.label === arr2[index].label
      );
    };
    
    if (!areArraysEqual(selectedOptions, value)) {
      onChange(selectedOptions);
    }
  }, [selectedOptions]);

  // Update local state when value prop changes, but avoid infinite loop
  useEffect(() => {
    // Only update local state if the value prop is different from current state
    const areArraysEqual = (arr1, arr2) => {
      if (!arr1 || !arr2) return false;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => 
        item.value === arr2[index].value && item.label === arr2[index].label
      );
    };
    
    if (!areArraysEqual(value, selectedOptions)) {
      setSelectedOptions(value || []);
    }
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option) => {
    // Check if option is already selected
    if (!selectedOptions.some(item => item.value === option.value)) {
      setSelectedOptions([...selectedOptions, option]);
    }
    setSearchTerm('');
    inputRef.current.focus();
  };

  const handleRemoveOption = (optionValue) => {
    setSelectedOptions(selectedOptions.filter(option => option.value !== optionValue));
    inputRef.current.focus();
  };

  const handleAddNewOption = () => {
    if (newOption.trim() !== '') {
      const newOptionObj = {
        value: newOption.toLowerCase().replace(/\s+/g, '_'),
        label: newOption
      };
      handleSelectOption(newOptionObj);
      setNewOption('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newOption.trim() !== '') {
      e.preventDefault();
      handleAddNewOption();
    } else if (e.key === 'Backspace' && searchTerm === '' && selectedOptions.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      handleRemoveOption(selectedOptions[selectedOptions.length - 1].value);
    }
  };

  const filteredOptions = options.filter(option => 
    !selectedOptions.some(selected => selected.value === option.value) &&
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showAddNew = allowNew && 
                     searchTerm.trim() !== '' && 
                     !options.some(option => option.label.toLowerCase() === searchTerm.toLowerCase()) &&
                     !selectedOptions.some(option => option.label.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div className="notion-multi-select-container" ref={containerRef}>
      <div 
        className="notion-multi-select-input-container" 
        onClick={() => {
          setIsDropdownOpen(true);
          inputRef.current.focus();
        }}
      >
        {selectedOptions.map(option => (
          <Badge 
            key={option.value} 
            className="notion-multi-select-badge me-1"
            bg="primary"
          >
            {option.label}
            <X 
              className="ms-1 notion-multi-select-remove" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveOption(option.value);
              }}
            />
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="notion-multi-select-search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setNewOption(e.target.value);
            if (!isDropdownOpen) setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          aria-labelledby={labelledBy}
        />
      </div>

      {isDropdownOpen && (
        <div className="notion-multi-select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div 
                key={option.value} 
                className="notion-multi-select-option"
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="notion-multi-select-no-options">
              {searchTerm ? 'No matching options' : 'No options available'}
            </div>
          )}
          
          {showAddNew && (
            <div 
              className="notion-multi-select-add-new"
              onClick={handleAddNewOption}
            >
              <Plus className="me-1" />
              Add "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotionMultiSelect;