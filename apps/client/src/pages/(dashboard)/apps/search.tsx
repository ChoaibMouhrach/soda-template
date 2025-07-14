import { CustomInput } from "@/components/custom/custom-input";
import { cn } from "@/lib/utils";
import { appsRoute } from "@/routes/dashboard";

interface SearchProps {
  className?: string;
}

export const Search: React.FC<SearchProps> = ({ className }) => {
  const search = appsRoute.useSearch();
  const navigate = appsRoute.useNavigate();

  const updateSearch = (q: string) => {
    navigate({
      search: (prevState) => ({
        ...prevState,
        q,
      }),
    });
  };

  return (
    <CustomInput
      className={cn("shadow-none", className)}
      value={search.q || ""}
      placeholder="Search..."
      onChange={(e) => updateSearch(e.target.value)}
    />
  );
};
