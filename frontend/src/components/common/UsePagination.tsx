import { useRouter, useSearchParams } from 'next/navigation';

export function usePagination(defaultPage = 1, defaultPageSize = 10) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || defaultPage;
  const pageSize = Number(searchParams.get("limit")) || defaultPageSize;

  const setPagination = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("limit", String(newPageSize));
    router.push(`?${params.toString()}`);
  };

  return { page, pageSize, setPagination };
}