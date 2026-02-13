"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-accent text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)] hover:bg-accent/90",
                outline:
                    "border border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white text-slate-300",
                ghost: "hover:bg-slate-800 hover:text-white text-slate-400",
                link: "text-indigo-400 underline-offset-4 hover:underline",
                glass: "bg-surface/50 backdrop-blur-md border border-white/10 hover:bg-surface/70 text-white",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-8 rounded-full px-4 text-xs",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

/* 
 * We need to combine VariantProps, HTMLMotionProps<"button">, and our own props.
 * `asChild` creates complexity with motion, so we'll keep it simple for now and omit Slot if strictly using motion. 
 * Actually, let's just make a standard motion button.
 */

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    variant?: "default" | "outline" | "ghost" | "link" | "glass" | null;
    size?: "default" | "sm" | "lg" | "icon" | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : motion.button;

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref as any}
                {...(asChild ? {} : { whileTap: { scale: 0.98 } })}
                {...props as any}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
