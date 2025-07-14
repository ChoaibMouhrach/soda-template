import {
  CustomCard,
  CustomCardContent,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/custom/custom-card";
import { TableBody } from "@/components/ui/table";
import type { TGetApps } from "@/api/apps/get-apps";
import { ClientSecretInput } from "./client-secret-input";
import { CustomCopyInput } from "@/components/custom/custom-copy-input";

interface CredentialsProps {
  refetch: VoidFunction;
  app: TGetApps["data"][number];
}

export const Credentials: React.FC<CredentialsProps> = ({ refetch, app }) => {
  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>App credentials</CustomCardTitle>
      </CustomCardHeader>
      <CustomCardContent>
        <table>
          <TableBody>
            <tr>
              <td>Client ID</td>
              <td className="py-2">
                <CustomCopyInput
                  className="bg-muted h-8"
                  value={app.app.id}
                  onChange={() => {}}
                />
              </td>
            </tr>
            <tr>
              <td>Client Secret</td>
              <td className="py-2">
                <ClientSecretInput
                  value={app.secret.secret}
                  onChange={() => {}}
                  appId={app.app.id}
                  refetch={refetch}
                />
              </td>
            </tr>
          </TableBody>
        </table>
      </CustomCardContent>
    </CustomCard>
  );
};
