'use client';

import * as React from 'react';

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ value, onValueChange, placeholder, children, className = '', disabled = false }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || '');
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setIsOpen(false);
    };

    const getSelectedLabel = () => {
      const selectedItem = React.Children.toArray(children).find(
        (child) => React.isValidElement<SelectItemProps>(child) && child.props.value === selectedValue
      );
      return selectedItem && React.isValidElement<SelectItemProps>(selectedItem)
        ? selectedItem.props.children
        : placeholder || 'Select...';
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={ref}
          type="button"
          className={`
            flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white 
            placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-gray-600 dark:bg-gray-800 dark:text-slate-200 dark:placeholder:text-gray-400 dark:ring-offset-gray-800 dark:focus:ring-blue-400
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedValue ? 'text-gray-900 dark:text-slate-200' : 'text-gray-500 dark:text-gray-400'}>
            {getSelectedLabel()}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
            {React.Children.map(children, (child) => {
              if (React.isValidElement<SelectItemProps>(child)) {
                return (
                  <button
                    key={child.props.value}
                    type="button"
                    className={`
                      w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                      dark:hover:bg-gray-700 dark:focus:bg-gray-700
                      ${child.props.value === selectedValue 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
                        : 'text-gray-900 dark:text-slate-200'}
                    `}
                    onClick={() => handleSelect(child.props.value)}
                  >
                    {child.props.children}
                  </button>
                );
              }
              return child;
            })}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

const SelectItem: React.FC<SelectItemProps> = ({ children }) => {
  return <>{children}</>;
};

SelectItem.displayName = 'SelectItem';

export { Select, SelectItem };