import type { TGetApps } from "@/api/apps/get-apps";
import {
  CustomSheetContent,
  CustomSheetFooter,
} from "@/components/custom/custom-sheet";
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
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/client";
import { onError } from "@/lib/utils";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { createAppSchema, type CreateAppPayload } from "@soda/validations";
import { useMutation } from "@tanstack/react-query";
import { Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpsertProps {
  refetch: VoidFunction;
  app?: TGetApps["data"][number]["app"];
}

export const Upsert: React.FC<UpsertProps> = ({ app, refetch }) => {
  const form = useForm({
    resolver: typeboxResolver(createAppSchema),
    values: app
      ? { title: app.title, description: app.description || "" }
      : {
          title: "",
          description: "",
        },
  });

  const upsert = useMutation({
    mutationFn: (payload: CreateAppPayload) => {
      if (app) {
        return onError(client.api.apps({ appId: app.id }).patch(payload));
      }

      return onError(client.api.apps.post(payload));
    },
    onSuccess: () => {
      refetch();

      if (app) {
        toast.success("App updated successfully");
        return;
      }

      toast.success("App created successfully");
      form.reset();
    },
    onError: ({ message }) => toast.error(message),
  });

  const onSubmit = (payload: CreateAppPayload) => {
    upsert.mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col flex-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CustomSheetContent className="flex flex-col gap-4">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <CustomInput {...field} placeholder="MyApp" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CustomSheetContent>

        <CustomSheetFooter>
          <Button pending={upsert.isPending} className="w-fit" type="submit">
            {app ? (
              <>
                {!upsert.isPending && <Save size={16} />}
                {"Save"}
              </>
            ) : (
              <>
                {!upsert.isPending && <Plus size={16} />}
                {"Add"}
              </>
            )}
          </Button>
        </CustomSheetFooter>
      </form>
    </Form>
  );
};
