'use client';

import * as React from 'react';

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
  checked?: boolean;
  onSelect?: () => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onValueChange, children, className = '' }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '');

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        className={`space-y-2 ${className}`}
        role="radiogroup"
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioGroupItemProps>(child)) {
            return React.cloneElement(child, {
              ...child.props,
              checked: child.props.value === internalValue,
              onSelect: () => handleValueChange(child.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(({ value, id, children, className = '', checked, onSelect }, ref) => {
  const itemId = id || `radio-${value}`;

  return (
    <div
      ref={ref}
      className={`flex items-center space-x-2 ${className}`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        id={itemId}
        onClick={onSelect}
        className={`
          w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors
          ${checked 
            ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500' 
            : 'border-gray-300 hover:border-gray-400 bg-white dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-800'
          }
        `}
      >
        {checked && (
          <div className="w-2 h-2 rounded-full bg-white" />
        )}
      </button>
      <label
        htmlFor={itemId}
        className="text-sm font-medium text-foreground cursor-pointer"
      >
        {children}
      </label>
    </div>
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };