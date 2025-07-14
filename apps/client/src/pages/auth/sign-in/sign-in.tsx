import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { signInSchema, type SignInPayload } from "@soda/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/custom/custom-input";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { onError } from "@/lib/utils";
import { RequestEmailConfirmation } from "@/components/custom/request-email-confirmation";
import { useState } from "react";
import { ERROR_CODES } from "@soda/constants";
import { Password } from "@/components/custom/password";

export const SignIn = () => {
  const [requestConfirmation, setRequestConfirmation] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: typeboxResolver(signInSchema),
    values: {
      email: "",
      password: "",
    },
  });

  const signIn = useMutation({
    mutationFn: (payload: SignInPayload) => {
      return onError(client.api.auth["sign-in"].post(payload));
    },
    onSuccess: () => {
      toast.success("Welcome");
      navigate({
        to: "/profile",
      });
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.name !== ERROR_CODES.UNCONFIRMED_EMAIL) {
        return;
      }

      setRequestConfirmation(true);
    },
  });

  const onSubmit = async (output: SignInPayload) => {
    signIn.mutate(output);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
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

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => {
              const email = form.getValues("email");

              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Password {...field} />
                      <div className="flex items-center">
                        {email && requestConfirmation && (
                          <RequestEmailConfirmation email={email} />
                        )}
                        <Link
                          className="text-primary ml-auto text-sm"
                          to="/forgot-password"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button
            size="lg"
            type="submit"
            pending={signIn.isPending}
            className="w-full"
          >
            Sign In
          </Button>

          <span className="text-muted-foreground text-center">
            Don't have an account ?{" "}
            <Link to="/sign-up" className="text-primary">
              Sign Up
            </Link>
          </span>
        </form>
      </Form>
    </>
  );
};
