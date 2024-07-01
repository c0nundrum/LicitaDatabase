import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <Button
        disabled={currentPage === 1}
        variant={"outline"}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </Button>
      <div className="text-center">
        {currentPage} de {totalPages}
      </div>
      <Button
        disabled={currentPage === totalPages}
        variant={"outline"}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
