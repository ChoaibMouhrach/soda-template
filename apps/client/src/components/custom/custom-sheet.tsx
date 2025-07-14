import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetProps,
  type SheetTriggerProps,
} from "@/components/ui/sheet";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CustomSheetProps extends SheetProps {
  children?: React.ReactNode;
}
export const CustomSheet: React.FC<CustomSheetProps> = ({
  children,
  ...props
}) => {
  return <Sheet {...props}>{children}</Sheet>;
};

export interface CustomSheetTriggerProps extends SheetTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export const CustomSheetTrigger: React.FC<CustomSheetTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <SheetTrigger {...props} className={cn(className)}>
    {children}
  </SheetTrigger>
);

export interface CustomSheetWrapperProps {
  className?: string;
  children?: React.ReactNode;
}
export const CustomSheetWrapper: React.FC<CustomSheetWrapperProps> = ({
  className,
  children,
  ...props
}) => (
  <SheetContent
    className={cn("flex flex-col sm:max-w-1/2", className)}
    {...props}
  >
    {children}
  </SheetContent>
);

export interface CustomSheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}
export const CustomSheetHeader: React.FC<CustomSheetHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <SheetHeader className={cn("bg-muted border-b", className)} {...props}>
    {children}
  </SheetHeader>
);

export interface CustomSheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children?: React.ReactNode;
}
export const CustomSheetTitle: React.FC<CustomSheetTitleProps> = ({
  className,
  children,
  ...props
}) => (
  <SheetTitle className={cn(className)} {...props}>
    {children}
  </SheetTitle>
);

export interface CustomSheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: React.ReactNode;
}
export const CustomSheetDescription: React.FC<CustomSheetDescriptionProps> = ({
  className,
  children,
  ...props
}) => (
  <SheetDescription className={cn(className)} {...props}>
    {children}
  </SheetDescription>
);

export interface CustomSheetFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export const CustomSheetFooter: React.FC<CustomSheetFooterProps> = ({
  className,
  children,
}) => {
  return (
    <SheetFooter className={cn("bg-muted border-t", className)}>
      {children}
    </SheetFooter>
  );
};

interface CustomSheetContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const CustomSheetContent: React.FC<CustomSheetContentProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("flex-1 overflow-y-auto px-4", className)}>
      {children}
    </div>
  );
};
