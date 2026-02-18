import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  elevatedOnHover?: boolean;
};

export function Card({ className, elevatedOnHover = false, ...props }: CardProps) {
  return <div className={cn("surface-card", elevatedOnHover && "surface-card-hover", className)} {...props} />;
}
