import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export type CustomInputProps = React.ComponentProps<"input">;

export const CustomInput: React.FC<CustomInputProps> = ({ ...props }) => {
  return <Input {...props} className={cn("bg-muted/30", props.className)} />;
};
