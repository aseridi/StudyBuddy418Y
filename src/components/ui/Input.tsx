'use client';
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (<div className="space-y-1">
        {label && (<label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>)}
        <input type={type} id={inputId} className={cn('flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white', 'placeholder:text-gray-400 dark:placeholder:text-gray-500', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', 'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-900', error && 'border-red-500 focus:ring-red-500', className)} ref={ref} {...props}/>
        {error && (<p className="text-sm text-red-600 dark:text-red-400">{error}</p>)}
        {hint && !error && (<p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>)}
      </div>);
});
Input.displayName = 'Input';
export { Input };
