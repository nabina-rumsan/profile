import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function usePagination(defaultPage = 1, defaultPageSize = 10) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || defaultPage;
  const pageSize = Number(searchParams.get("limit")) || defaultPageSize;


  useEffect(() => {
    // If page or limit are missing, update the URL to include defaults
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      const params = new URLSearchParams();
      if (!searchParams.get("page")) params.set("page", String(defaultPage));
      if (!searchParams.get("limit")) params.set("limit", String(defaultPageSize));
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router, defaultPage, defaultPageSize]);

  const setPagination = (newPage: number, newPageSize: number, newSearch?: string) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    params.set("limit", String(newPageSize));
    if (newSearch && newSearch.trim() !== "") {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString().replace(/\+/g, '%20')}`);

  };

  return { page, pageSize, setPagination };
}
