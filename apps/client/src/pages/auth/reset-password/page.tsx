import { ResetPassword } from "./reset-password";
import { resetPasswordRoute } from "@/routes/auth";

export const ResetPasswordPage = () => {
  const { token } = resetPasswordRoute.useSearch();

  if (!token) {
    return <div>Error</div>;
  }

  return <ResetPassword token={token} />;
};
