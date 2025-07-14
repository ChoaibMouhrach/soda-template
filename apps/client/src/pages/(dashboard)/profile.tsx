import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoorOpen, Loader2, User } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { onError } from "@/lib/utils";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { env } from "@/lib/env";

export const Profile = () => {
  const navigate = useNavigate();

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => onError(client.api.auth.profile.get()),
  });

  const signOut = useMutation({
    mutationFn: () => onError(client.api.auth["sign-out"].post()),
    onSuccess: () => {
      navigate({
        to: "/sign-in",
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSignOut = () => {
    signOut.mutate();
  };

  if (profile.isSuccess) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto cursor-pointer outline-0">
          <Avatar className="rounded-md">
            {profile.data.user.avatar && (
              <AvatarImage
                src={env.VITE_STORAGE_URL + "/" + profile.data.user.avatar}
                className="object-cover"
              />
            )}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex flex-col gap-1">
            My account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to="/profile">
              <User />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              onSignOut();
            }}
          >
            {signOut.isPending ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <DoorOpen size={15} />
            )}{" "}
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="relative flex size-8 shrink-0 overflow-hidden bg-muted ml-auto rounded-md" />
  );
};
