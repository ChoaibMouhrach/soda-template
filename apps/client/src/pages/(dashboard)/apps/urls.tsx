import {
  CustomCard,
  CustomCardContent,
  CustomCardDescription,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/custom/custom-card";
import type { TGetApps } from "@/api/apps/get-apps";
import { CustomInput } from "@/components/custom/custom-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { client } from "@/lib/client";
import { onError } from "@/lib/utils";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useMutation } from "@tanstack/react-query";
import { t, type Static } from "elysia";
import { PlusIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const setRedirectUrlsSchema = t.Object({
  urls: t.Array(
    t.Object({
      id: t.String(),
      url: t.String({ format: "uri-template" }),
    }),
  ),
});

type SetRedirectUrlsPayload = Static<typeof setRedirectUrlsSchema>;

interface UrlsProps {
  appId: string;
  refetch: VoidFunction;
  urls: TGetApps["data"][number]["redirectUrls"];
}

export const Urls: React.FC<UrlsProps> = ({ urls, appId, refetch }) => {
  const setRedirectUrls = useMutation({
    mutationFn: (payload: SetRedirectUrlsPayload) => {
      return onError(
        client.api.apps({ appId })["redirect-urls"].post({
          urls: payload.urls.map(({ url }) => url),
        }),
      );
    },
    onSuccess: () => {
      toast.success("Redirect urls updated successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const form = useForm<SetRedirectUrlsPayload>({
    resolver: typeboxResolver(setRedirectUrlsSchema),
    disabled: setRedirectUrls.isPending,
    values: {
      urls: urls.map((url) => ({
        id: url.id,
        url: url.url,
      })),
    },
  });

  const onSubmit = (payload: SetRedirectUrlsPayload) => {
    setRedirectUrls.mutate(payload);
  };

  const addUrl = () => {
    const urls = form.getValues("urls");
    form.setValue("urls", [...urls, { id: String(Math.random()), url: "" }]);
  };

  const removeUrl = (id: string) => {
    const urls = form.getValues("urls");
    form.setValue(
      "urls",
      urls.filter((url) => url.id !== id),
    );
  };

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Redirect urls</CustomCardTitle>
        <CustomCardDescription className="hidden" />
      </CustomCardHeader>
      <CustomCardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              {form.watch("urls").map((url, index) => {
                const errors = form.formState.errors.urls;

                return (
                  <FormField
                    key={url.id}
                    name={`urls.${index}`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <CustomInput
                              {...field}
                              value={field.value.url}
                              placeholder="https://yourapp.com/callback"
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  url: e.target.value,
                                })
                              }
                            />
                            <Button
                              variant="destructive"
                              onClick={() => removeUrl(field.value.id)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </FormControl>
                        {errors && (
                          <span className="text-destructive text-sm">
                            {errors[index]?.url?.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={addUrl}
              disabled={setRedirectUrls.isPending}
              className="text-primary w-fit flex items-center gap-1 cursor-pointer disabled:text-muted-foreground"
            >
              <PlusIcon size={14} /> Add url
            </button>

            <Button
              type="submit"
              className="w-fit"
              pending={setRedirectUrls.isPending}
            >
              {!setRedirectUrls.isPending && <SaveIcon />}
              Save
            </Button>
          </form>
        </Form>
      </CustomCardContent>
    </CustomCard>
  );
};
