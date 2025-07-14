import {
  CustomSheet,
  CustomSheetDescription,
  CustomSheetHeader,
  CustomSheetTitle,
  CustomSheetTrigger,
  CustomSheetWrapper,
} from "@/components/custom/custom-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upsert } from "./upsert";

interface NewProps {
  className?: string;
  refetch: VoidFunction;
}

export const New: React.FC<NewProps> = ({ className, refetch }) => {
  return (
    <CustomSheet>
      <CustomSheetTrigger asChild className={cn("", className)}>
        <Button>Add</Button>
      </CustomSheetTrigger>
      <CustomSheetWrapper>
        <CustomSheetHeader>
          <CustomSheetTitle>New App</CustomSheetTitle>
          <CustomSheetDescription className="hidden" />
        </CustomSheetHeader>
        <Upsert refetch={refetch} />
      </CustomSheetWrapper>
    </CustomSheet>
  );
};
