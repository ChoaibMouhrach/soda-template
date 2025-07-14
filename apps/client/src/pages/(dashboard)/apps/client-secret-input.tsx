import { useId, useRef, useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react";
import {
  CustomInput,
  type CustomInputProps,
} from "@/components/custom/custom-input";
import { cn, onError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";

export interface PasswordProps extends CustomInputProps {
  appId: string;
  refetch: VoidFunction;
}

export const ClientSecretInput: React.FC<PasswordProps> = ({
  appId,
  refetch,
  ...props
}) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const refreshSecret = useMutation({
    mutationFn: () => {
      return onError(client.api.apps({ appId })["refresh-secret"].post());
    },
    onSuccess: () => {
      toast.success("Secret refreshed successfully");
      refetch();
    },
    onError: (err) => {
      toast.success(err.message);
    },
  });

  const toggleVisibility = () => {
    return setIsVisible((prevState) => !prevState);
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleRefresh = () => {
    refreshSecret.mutate();
  };

  return (
    <div className="relative">
      <CustomInput
        {...props}
        id={id}
        ref={inputRef}
        className="pe-24"
        placeholder="Password"
        type={isVisible ? "text" : "password"}
      />
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-14 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <EyeOffIcon size={16} aria-hidden="true" />
        ) : (
          <EyeIcon size={16} aria-hidden="true" />
        )}
      </button>
      <button
        onClick={handleCopy}
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-7 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        disabled={copied}
      >
        <div
          className={cn(
            "transition-all",
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        >
          <CheckIcon
            className="stroke-emerald-500"
            size={16}
            aria-hidden="true"
          />
        </div>
        <div
          className={cn(
            "absolute transition-all",
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <CopyIcon size={16} aria-hidden="true" />
        </div>
      </button>
      <button
        onClick={handleRefresh}
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
        disabled={refreshSecret.isPending}
      >
        {refreshSecret.isPending ? (
          <Loader2Icon size={16} className="animate-spin" />
        ) : (
          <RefreshCwIcon size={16} />
        )}
      </button>
    </div>
  );
};
