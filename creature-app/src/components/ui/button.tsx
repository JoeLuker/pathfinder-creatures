import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-interactive-primary text-inverse shadow hover:bg-interactive-primary-hover",
        destructive:
          "bg-status-error text-inverse shadow-sm hover:bg-interactive-danger-hover",
        outline:
          "border border-primary bg-surface-primary shadow-sm hover:bg-interactive-secondary hover:text-primary",
        secondary:
          "bg-surface-secondary text-primary shadow-sm hover:bg-interactive-secondary-hover",
        ghost: "hover:bg-interactive-secondary hover:text-primary",
        link: "text-interactive-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-1 py-0",
        sm: "h-8 rounded-md px-2 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }