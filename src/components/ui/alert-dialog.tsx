import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/* -----------------------------------------------------------------------------
 * Component: AlertDialog
 * -------------------------------------------------------------------------- */

interface AlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> {}

const AlertDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Root>,
  AlertDialogProps
>(({ ...props }, ref) => (
  // Remove ref from here as AlertDialogPrimitive.Root doesn't directly accept it
  <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
));

AlertDialog.displayName = AlertDialogPrimitive.Root.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogTrigger
 * -------------------------------------------------------------------------- */

interface AlertDialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger> {}

const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  AlertDialogTriggerProps
>(({ ...props }, ref) => (
  <AlertDialogPrimitive.Trigger
    data-slot="alert-dialog-trigger"
    ref={ref}
    {...props}
  />
));

AlertDialogTrigger.displayName = AlertDialogPrimitive.Trigger.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogPortal
 * -------------------------------------------------------------------------- */

interface AlertDialogPortalProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Portal> {}

const AlertDialogPortal = ({ ...props }: AlertDialogPortalProps) => (
  <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
);

/* -----------------------------------------------------------------------------
 * Component: AlertDialogOverlay
 * -------------------------------------------------------------------------- */

interface AlertDialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> {}

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    data-slot="alert-dialog-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));

AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogContent
 * -------------------------------------------------------------------------- */

interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      data-slot="alert-dialog-content"
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 sm:max-w-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));

AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogHeader
 * -------------------------------------------------------------------------- */

interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => (
  <div
    data-slot="alert-dialog-header"
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);

/* -----------------------------------------------------------------------------
 * Component: AlertDialogFooter
 * -------------------------------------------------------------------------- */

interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);

/* -----------------------------------------------------------------------------
 * Component: AlertDialogTitle
 * -------------------------------------------------------------------------- */

interface AlertDialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {}

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));

AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogDescription
 * -------------------------------------------------------------------------- */

interface AlertDialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> {}

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogAction
 * -------------------------------------------------------------------------- */

interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {}

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));

AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

/* -----------------------------------------------------------------------------
 * Component: AlertDialogCancel
 * -------------------------------------------------------------------------- */

interface AlertDialogCancelProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> {}

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
));

AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

/* -----------------------------------------------------------------------------
 * Exports
 * -------------------------------------------------------------------------- */

export {
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
};