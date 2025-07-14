import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit } from "./edit";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TGetApps } from "@/api/apps/get-apps";
import { Remove } from "./remove";
import { Settings } from "./settings";

interface OptionsProps {
  refetch: VoidFunction;
  app: TGetApps["data"][number];
}

export const Options: React.FC<OptionsProps> = ({ refetch, app }) => {
  const [open, setOpen] = useState<"edit" | "remove" | "settings" | null>(null);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="ml-auto cursor-pointer" asChild>
          <Button variant="secondary" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen("settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("edit")}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("remove")}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Edit
        app={app.app}
        refetch={refetch}
        open={open === "edit"}
        onOpenChange={(open) => setOpen(open ? "edit" : null)}
      />

      <Remove
        appId={app.app.id}
        refetch={refetch}
        open={open === "remove"}
        onOpenChange={(open) => setOpen(open ? "remove" : null)}
      />

      <Settings
        app={app}
        refetch={refetch}
        open={open === "settings"}
        onOpenChange={(open) => setOpen(open ? "settings" : null)}
      />
    </>
  );
};
