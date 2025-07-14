import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Options } from "./options";
import type { TGetApps } from "@/api/apps/get-apps";

const columns = ["Name", ""];

interface AppsProps {
  apps: TGetApps["data"];
  refetch: VoidFunction;
}

export const Apps: React.FC<AppsProps> = ({ apps, refetch }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{app.app.title}</TableCell>
              <TableCell className="text-right">
                <Options refetch={refetch} app={app} />
              </TableCell>
            </TableRow>
          ))}
          {!apps.length && (
            <TableRow>
              <TableCell colSpan={columns.length}>No results</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
