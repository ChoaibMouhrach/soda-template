import {
  CustomSheet,
  CustomSheetDescription,
  CustomSheetHeader,
  CustomSheetTitle,
  CustomSheetWrapper,
} from "@/components/custom/custom-sheet";
import { Upsert } from "./upsert";
import type { TGetApps } from "@/api/apps/get-apps";

interface NewProps {
  open?: boolean;
  refetch: VoidFunction;
  app: TGetApps["data"][number]["app"];
  onOpenChange?: (open: boolean) => void;
}

export const Edit: React.FC<NewProps> = ({
  refetch,
  open,
  onOpenChange,
  app,
}) => {
  return (
    <CustomSheet open={open} onOpenChange={onOpenChange}>
      <CustomSheetWrapper>
        <CustomSheetHeader>
          <CustomSheetTitle>Edit App</CustomSheetTitle>
          <CustomSheetDescription className="hidden" />
        </CustomSheetHeader>
        <Upsert refetch={refetch} app={app} />
      </CustomSheetWrapper>
    </CustomSheet>
  );
};
