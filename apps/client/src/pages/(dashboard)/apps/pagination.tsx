import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  lastPage: number;
  onPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  lastPage,
  onPage,
}) => {
  return (
    <div className="flex items-center">
      <span>
        Page {page} of {lastPage}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={page - 1 <= 0}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page + 1 > lastPage}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
