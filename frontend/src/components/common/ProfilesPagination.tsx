'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type PaginationProps = {
  page: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions?: number[];
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
};

export default function ProfilesPagination({
  page,
  pageSize,
  totalCount,
  pageSizeOptions = [5, 10, 15, 20],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex gap-2 items-center justify-center mt-4">
      <span>Rows per page:</span>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => {
          onPageSizeChange(Number(value));
        }}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Rows per page" />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>

      <span>
        Page {page} of {totalPages || 1}
      </span>

      <Button
        disabled={page === totalPages || totalPages === 0}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
