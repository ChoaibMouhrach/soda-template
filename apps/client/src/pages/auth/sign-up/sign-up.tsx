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
import { signUpSchema, type SignUpPayload } from "@soda/validations";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SignUp = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: typeboxResolver(signUpSchema),
    values: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const signup = useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const response = client.api.auth["sign-up"].post({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        passwordConfirmation: payload.passwordConfirmation,
      });

      return await onError(response);
    },
    onSuccess: () => {
      toast.success("Check your email inbox");
      navigate({
        to: "/sign-in",
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (payload: SignUpPayload) => {
    signup.mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <CustomInput {...field} placeholder="John" />
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
                  <CustomInput {...field} placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <Button type="submit" pending={signup.isPending}>
          Sign Up <ArrowRight size={16} />
        </Button>

        <span className="text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-primary">
            Sign in
          </Link>
        </span>
      </form>
    </Form>
  );
};
