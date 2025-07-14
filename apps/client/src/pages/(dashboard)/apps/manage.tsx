import { Apps } from "./apps";
import { Pagination } from "./pagination";
import { Search } from "./search";
import {
  CustomCard,
  CustomCardContent,
  CustomCardDescription,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/custom/custom-card";
import { New } from "./new";
import { useQuery } from "@tanstack/react-query";
import { getApps } from "@/api/apps/get-apps";
import { appsRoute } from "@/routes/dashboard";

export const Manage = () => {
  const { page, q } = appsRoute.useSearch();
  const navigate = appsRoute.useNavigate();

  const changeSearch = (name: string, value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        [name]: value,
      }),
    });
  };

  const apps = useQuery({
    placeholderData: (ph) => ph,
    queryKey: ["apps", q, page],
    queryFn: () => {
      return getApps({
        page,
        q,
      });
    },
  });

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Apps</CustomCardTitle>
        <CustomCardDescription>
          You can manage your apps from here.
        </CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent className="gap-4">
        <div className="flex items-center gap-2">
          <Search className="max-w-md" />
          <New className="ml-auto" refetch={apps.refetch} />
        </div>
        {apps.isSuccess && (
          <>
            <Apps apps={apps.data.data} refetch={apps.refetch} />
            <Pagination
              page={page}
              lastPage={apps.data.meta.lastPage}
              onPage={(page) => changeSearch("page", String(page))}
            />
          </>
        )}
      </CustomCardContent>
    </CustomCard>
  );
};
