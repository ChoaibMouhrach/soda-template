import { client } from "@/lib/client";
import { cn, onError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RequestEmailConfirmationProps {
  email: string;
}

export const RequestEmailConfirmation: React.FC<
  RequestEmailConfirmationProps
> = ({ email }) => {
  const requestEmailConfirmation = useMutation({
    mutationFn: () => {
      return onError(
        client.api.auth["request-email-confirmation"].post({
          email,
        })
      );
    },
    onSuccess: () => {
      toast.success("confirmation email requested successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = () => {
    requestEmailConfirmation.mutate();
  };

  return (
    <span className={"text-muted-foreground text-sm"}>
      Didn{"'"}t get the email?{" "}
      <button
        disabled={requestEmailConfirmation.isPending}
        className={cn(
          "text-primary",
          requestEmailConfirmation.isPending ? "cursor-wait" : "cursor-pointer"
        )}
        type="button"
        onClick={onSubmit}
      >
        <div className="flex items-center gap-1">
          Resend it.{" "}
          {requestEmailConfirmation.isPending && (
            <Loader2 size={12} className="animate-spin" />
          )}
        </div>
      </button>
    </span>
  );
};
