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
  changePasswordSchema,
  type ChangePasswordPayload,
} from "@soda/validations";
import { useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const ChangePassword = () => {
  const changePassword = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return onError(client.api.auth["change-password"].post(payload));
    },
    onSuccess: () => {
      toast.success("password changed successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const form = useForm({
    resolver: typeboxResolver(changePasswordSchema),
    disabled: changePassword.isPending,
    values: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const onSubmit = (payload: ChangePasswordPayload) => {
    changePassword.mutate(payload);
  };

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Change Password</CustomCardTitle>
      </CustomCardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CustomCardContent>
            <FormField
              name="currentPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <CustomInput
                      {...field}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <CustomInput
                      {...field}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="newPasswordConfirmation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <CustomInput
                      {...field}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CustomCardContent>
          <CustomCardFooter>
            <Button type="submit" pending={changePassword.isPending}>
              {!changePassword.isPending && <Save />}
              Save
            </Button>
          </CustomCardFooter>
        </form>
      </Form>
    </CustomCard>
  );
};
