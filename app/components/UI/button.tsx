import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/functions/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-green-400 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-green-600 text-white hover:bg-green-500 hover:shadow-md active:bg-green-700 active:scale-[0.98] dark:bg-green-500 dark:text-gray-950 dark:hover:bg-green-400 border border-green-700 dark:border-green-600",
        destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-md active:bg-red-700 active:scale-[0.98] dark:bg-red-600 dark:hover:bg-red-500 dark:text-gray-50",
        outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 active:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-50 dark:hover:border-gray-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-sm active:bg-gray-300 active:scale-[0.98] dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        ghost: "hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "text-green-600 underline-offset-4 hover:underline hover:text-green-700 active:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-0 h-auto shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10 rounded-full",
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
  asChild?: boolean;
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