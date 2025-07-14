import {
  CustomSheet,
  CustomSheetContent,
  CustomSheetDescription,
  CustomSheetHeader,
  CustomSheetTitle,
  CustomSheetWrapper,
} from "@/components/custom/custom-sheet";
import { Credentials } from "./credentials";
import type { TGetApps } from "@/api/apps/get-apps";
import { Urls } from "./urls";

interface ShowProps {
  refetch: VoidFunction;
  open: boolean;
  app: TGetApps["data"][number];
  onOpenChange: (open: boolean) => void;
}

export const Settings: React.FC<ShowProps> = ({
  open,
  onOpenChange,
  app,
  refetch,
}) => {
  return (
    <CustomSheet open={open} onOpenChange={onOpenChange}>
      <CustomSheetWrapper>
        <CustomSheetHeader>
          <CustomSheetTitle>Settings</CustomSheetTitle>
          <CustomSheetDescription className="hidden" />
        </CustomSheetHeader>
        <CustomSheetContent className="flex flex-col gap-2">
          <Credentials refetch={refetch} app={app} />
          <Urls urls={app.redirectUrls} appId={app.app.id} refetch={refetch} />
        </CustomSheetContent>
      </CustomSheetWrapper>
    </CustomSheet>
  );
};
