import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/functions/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-green-400/40",
  {
    variants: {
      variant: {
        default: "bg-green-600 text-white border border-transparent hover:bg-green-700 active:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800 dark:text-gray-50",
        
        destructive: "bg-red-500 text-white border border-transparent hover:bg-red-600 active:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800 dark:text-white",
        
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800/50 dark:hover:border-gray-500 dark:active:bg-gray-800",
        
        secondary: "px-8 py-6 bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors text-center",
        
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:active:bg-gray-700",
        
        link: "text-green-600 underline-offset-4 hover:underline hover:text-green-700 active:text-green-800 dark:text-green-500 dark:hover:text-green-400 p-0 h-auto shadow-none",
        
        primaryOutline: "border border-green-600 bg-transparent text-green-600 hover:bg-green-50 hover:border-green-700 hover:text-green-700 active:bg-green-100 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-950 dark:hover:border-green-400 dark:hover:text-green-400 dark:active:bg-green-900/50"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };