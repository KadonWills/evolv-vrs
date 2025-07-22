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
            flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
            placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedValue ? 'text-foreground' : 'text-muted-foreground'}>
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
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-border bg-popover py-1 shadow-lg">
            {React.Children.map(children, (child) => {
              if (React.isValidElement<SelectItemProps>(child)) {
                return (
                  <button
                    key={child.props.value}
                    type="button"
                    className={`
                      w-full px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none
                      ${child.props.value === selectedValue 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-popover-foreground'}
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