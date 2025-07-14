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
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { SOMETHING_WENT_WRONG } from "@soda/constants";
import {
  forgotPasswordSchema,
  type ForgotPasswordPayload,
} from "@soda/validations";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const ForgotPassword = () => {
  const form = useForm({
    resolver: typeboxResolver(forgotPasswordSchema),
    values: {
      email: "",
    },
  });

  const forgetPassword = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const { data, error } = await client.api.auth["forgot-password"].post({
        email: payload.email,
      });

      if (!error) {
        return data;
      }

      const err = error.value;

      throw new Error(
        "error" in err && typeof err.error === "string"
          ? err.error
          : SOMETHING_WENT_WRONG
      );
    },
    onSuccess: () => {
      toast.success("Check your email inbox");
      form.reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (payload: ForgotPasswordPayload) => {
    forgetPassword.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <Link to="/sign-in" className="w-fit flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> Back
        </Link>

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="example@example.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4"
          pending={forgetPassword.isPending}
        >
          Send Reset Link
        </Button>
      </form>
    </Form>
  );
};
