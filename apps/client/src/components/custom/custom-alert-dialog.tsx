import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export type CustomAlertDialogProps = React.ComponentProps<typeof AlertDialog>;

export const CustomAlertDialog = (props: CustomAlertDialogProps) => {
  return <AlertDialog {...props} />;
};

export type CustomAlertDialogTriggerProps = React.ComponentProps<
  typeof AlertDialogTrigger
>;

export const CustomAlertDialogTrigger = ({
  className,
  ...props
}: CustomAlertDialogTriggerProps) => {
  return <AlertDialogTrigger className={cn(className)} {...props} />;
};

export type CustomAlertDialogPortalProps = React.ComponentProps<
  typeof AlertDialogPortal
>;

export const CustomAlertDialogPortal = (
  props: CustomAlertDialogPortalProps
) => {
  return <AlertDialogPortal {...props} />;
};

export type CustomAlertDialogOverlayProps = React.ComponentProps<
  typeof AlertDialogOverlay
>;

export const CustomAlertDialogOverlay = ({
  className,
  ...props
}: CustomAlertDialogOverlayProps) => {
  return <AlertDialogOverlay className={cn(className)} {...props} />;
};

export type CustomAlertDialogContentProps = React.ComponentProps<
  typeof AlertDialogContent
>;

export const CustomAlertDialogContent = ({
  className,
  ...props
}: CustomAlertDialogContentProps) => {
  return (
    <AlertDialogContent
      className={cn("p-0 overflow-hidden gap-0", className)}
      {...props}
    />
  );
};

export type CustomAlertDialogHeaderProps = React.ComponentProps<
  typeof AlertDialogHeader
>;

export const CustomAlertDialogHeader = ({
  className,
  ...props
}: CustomAlertDialogHeaderProps) => {
  return (
    <AlertDialogHeader
      className={cn("p-4 bg-muted border-b", className)}
      {...props}
    />
  );
};

export type CustomAlertDialogFooterProps = React.ComponentProps<
  typeof AlertDialogFooter
>;

export const CustomAlertDialogFooter = ({
  className,
  ...props
}: CustomAlertDialogFooterProps) => {
  return <AlertDialogFooter className={cn("p-4", className)} {...props} />;
};

export type CustomAlertDialogTitleProps = React.ComponentProps<
  typeof AlertDialogTitle
>;

export const CustomAlertDialogTitle = ({
  className,
  ...props
}: CustomAlertDialogTitleProps) => {
  return <AlertDialogTitle className={cn(className)} {...props} />;
};

export type CustomAlertDialogDescriptionProps = React.ComponentProps<
  typeof AlertDialogDescription
>;

export const CustomAlertDialogDescription = ({
  className,
  ...props
}: CustomAlertDialogDescriptionProps) => {
  return <AlertDialogDescription className={cn(className)} {...props} />;
};

export type CustomAlertDialogActionProps = React.ComponentProps<
  typeof AlertDialogAction
>;

export const CustomAlertDialogAction = ({
  className,
  ...props
}: CustomAlertDialogActionProps) => {
  return <AlertDialogAction className={cn(className)} {...props} />;
};

export type CustomAlertDialogCancelProps = React.ComponentProps<
  typeof AlertDialogCancel
>;

export const CustomAlertDialogCancel = ({
  className,
  ...props
}: CustomAlertDialogCancelProps) => {
  return <AlertDialogCancel className={cn(className)} {...props} />;
};
