import type { TGetProfile } from "@/api/auth/profile";
import {
  CustomCard,
  CustomCardContent,
  CustomCardFooter,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomInput } from "@/components/custom/custom-input";
import { client } from "@/lib/client";
import { onError } from "@/lib/utils";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import {
  updateProfileSchema,
  type UpdateProfilePayload,
} from "@soda/validations";
import { useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AvatarInput } from "./avatar";

interface ProfileProps {
  profile: TGetProfile;
  refetch: VoidFunction;
}

export const Profile: React.FC<ProfileProps> = ({ profile, refetch }) => {
  const form = useForm({
    resolver: typeboxResolver(updateProfileSchema),
    values: {
      firstName: profile.user.firstName,
      lastName: profile.user.lastName,
      avatar: null,
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return onError(client.api.auth.profile.patch(payload));
    },
    onSuccess: () => {
      toast.success("profile updated successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (payload: UpdateProfilePayload) => {
    updateProfile.mutate(payload);
  };

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Profile</CustomCardTitle>
      </CustomCardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CustomCardContent className="grid-cols-2">
            <FormField
              name="avatar"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-start-1 col-end-3">
                  <FormControl>
                    <AvatarInput
                      setValue={field.onChange}
                      value={field.value}
                      lastName={profile.user.lastName}
                      firstName={profile.user.firstName}
                      defaultValue={profile.user.avatar}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <CustomInput
                      {...field}
                      placeholder="John"
                      disabled={updateProfile.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <CustomInput
                      {...field}
                      placeholder="Johm"
                      disabled={updateProfile.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CustomCardContent>
          <CustomCardFooter>
            <Button type="submit" pending={updateProfile.isPending}>
              {!updateProfile.isPending && <Save />}
              Save
            </Button>
          </CustomCardFooter>
        </form>
      </Form>
    </CustomCard>
  );
};
