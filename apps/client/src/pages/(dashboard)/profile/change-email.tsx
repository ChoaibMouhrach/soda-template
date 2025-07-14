import {
  CustomCard,
  CustomCardContent,
  CustomCardFooter,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomInput } from "@/components/custom/custom-input";
import { useForm } from "react-hook-form";
import {
  requestChangeEmailAddressPayload,
  type RequestChangeEmailAddressPayload,
} from "@soda/validations";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { onError } from "@/lib/utils";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface ChangeEmailProps {
  email: string;
}

export const ChangeEmail: React.FC<ChangeEmailProps> = ({ email }) => {
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const requestChangeEmailAddress = useMutation({
    mutationFn: (payload: RequestChangeEmailAddressPayload) => {
      return onError(
        client.api.auth["request-change-email-address"].post(payload)
      );
    },
    onSuccess: () => {
      toast.success("Check your inbox");
      form.reset();
      setConfirmationDialog(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const form = useForm({
    resolver: typeboxResolver(requestChangeEmailAddressPayload),
    mode: "onChange",
    disabled: requestChangeEmailAddress.isPending,
    values: {
      email,
      password: "",
    },
  });

  const onSubmit = (payload: RequestChangeEmailAddressPayload) => {
    requestChangeEmailAddress.mutate(payload);
  };

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Change email address</CustomCardTitle>
      </CustomCardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
          <CustomCardContent>
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
          </CustomCardContent>
          <CustomCardFooter>
            <AlertDialog
              open={confirmationDialog}
              onOpenChange={setConfirmationDialog}
            >
              <AlertDialogTrigger asChild>
                <Button disabled={!!form.formState.errors.email}>
                  <Save />
                  Save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter password</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the account password to continue
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel></FormLabel>
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
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    asChild
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    <Button pending={requestChangeEmailAddress.isPending}>
                      Send verification
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CustomCardFooter>
        </form>
      </Form>
    </CustomCard>
  );
};
