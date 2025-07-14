import {
  CustomAlertDialog,
  CustomAlertDialogCancel,
  CustomAlertDialogContent,
  CustomAlertDialogDescription,
  CustomAlertDialogFooter,
  CustomAlertDialogHeader,
  CustomAlertDialogTitle,
} from "@/components/custom/custom-alert-dialog";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client";
import { onError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface RemoveProps {
  open: boolean;
  appId: string;
  refetch: VoidFunction;
  onOpenChange: (open: boolean) => void;
}

export const Remove: React.FC<RemoveProps> = ({
  open,
  onOpenChange,
  refetch,
  appId,
}) => {
  const remove = useMutation({
    mutationFn: () => {
      return onError(client.api.apps({ appId: appId }).delete());
    },
    onSuccess: () => {
      toast.success("App removed successfully");
      onOpenChange(false);
      refetch();
    },
    onError: ({ message }) => toast.error(message),
  });

  const onRemove = () => {
    remove.mutate();
  };

  return (
    <CustomAlertDialog open={open} onOpenChange={onOpenChange}>
      <CustomAlertDialogContent>
        <CustomAlertDialogHeader>
          <CustomAlertDialogTitle>
            Are you absolutely sure?
          </CustomAlertDialogTitle>
          <CustomAlertDialogDescription>
            This action cannot be undone. This will permanently delete this app
            and remove it from our servers.
          </CustomAlertDialogDescription>
        </CustomAlertDialogHeader>
        <CustomAlertDialogFooter>
          <CustomAlertDialogCancel disabled={remove.isPending}>
            Cancel
          </CustomAlertDialogCancel>
          <Button
            pending={remove.isPending}
            variant="destructive"
            onClick={onRemove}
          >
            Remove
          </Button>
        </CustomAlertDialogFooter>
      </CustomAlertDialogContent>
    </CustomAlertDialog>
  );
};
