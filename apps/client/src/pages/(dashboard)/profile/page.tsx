import { useQuery } from "@tanstack/react-query";
import { ChangeEmail } from "./change-email";
import { ChangePassword } from "./change-password";
import { Profile } from "./profile";
import { getProfile } from "@/api/auth/profile";
import { ThemeToggle } from "./theme-toggle";

export const ProfilePage = () => {
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (profile.isSuccess) {
    return (
      <>
        <h1 className="text-xl">Profile</h1>
        <Profile profile={profile.data} refetch={profile.refetch} />
        <ChangeEmail email={profile.data.user.email} />
        <ChangePassword />
        <ThemeToggle />
      </>
    );
  }

  return "laoding...";
};
