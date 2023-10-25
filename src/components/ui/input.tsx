import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  addOn?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, addOn, type, ...props }, ref) => {
    if (addOn) {
      return (
        <div className="relative w-full">
          <div className="flex focus-within:ring-2 focus-within:ring-neutral-950 focus-within:ring-offset-2 focus-within:rounded-md w-full">
            <span className="inline-flex items-center rounded-l-md border border-neutral-200 bg-neutral-100 px-3 text-neutral-500 sm:text-sm">
              {addOn}
            </span>
            <input
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border border-l-0 rounded-l-none border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
                className,
              )}
              ref={ref}
              {...props}
            />
          </div>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
