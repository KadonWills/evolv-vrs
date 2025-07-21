type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  inputs.forEach(input => {
    if (!input) return;
    
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (typeof input === 'object' && !Array.isArray(input)) {
      Object.keys(input).forEach(key => {
        if (input[key]) classes.push(key);
      });
    } else if (Array.isArray(input)) {
      classes.push(clsx(...input));
    }
  });
  
  return classes.join(' ');
}

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}