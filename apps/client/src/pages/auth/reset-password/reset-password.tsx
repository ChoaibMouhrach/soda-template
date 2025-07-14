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
  resetPasswordSchema,
  type ResetPasswordPayload,
} from "@soda/validations";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResetPasswordProps {
  token: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: typeboxResolver(resetPasswordSchema),
    values: {
      token,
      password: "",
      passwordConfirmation: "",
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      return onError(client.api.auth["reset-password"].post(payload));
    },
    onSuccess: () => {
      toast.success("password reset successfully");
      navigate({
        to: "/sign-in",
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (payload: ResetPasswordPayload) => {
    resetPassword.mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
          name="passwordConfirmation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
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

        <Button type="submit" pending={resetPassword.isPending}>
          Reset password
        </Button>
      </form>
    </Form>
  );
};
