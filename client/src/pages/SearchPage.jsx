import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { searchMedicines } from "@/features/medicine/medicineSlice";
import { MedicineCard } from "@/components/medicine/MedicineCard";
import { SearchSidebar } from "@/components/medicine/SearchSidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const defaults = {
  q: "",
  category: "All",
  minPrice: "",
  maxPrice: "",
  prescriptionRequired: "all",
  inStock: "",
  sort: "popular",
  page: "1",
  limit: "9",
};

export default function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftQuery, setDraftQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebouncedValue(draftQuery, 350);
  const { searchResults, searchLoading } = useSelector((state) => state.medicine);

  const filters = useMemo(
    () => ({
      q: searchParams.get("q") || defaults.q,
      category: searchParams.get("category") || defaults.category,
      minPrice: searchParams.get("minPrice") || defaults.minPrice,
      maxPrice: searchParams.get("maxPrice") || defaults.maxPrice,
      prescriptionRequired: searchParams.get("prescriptionRequired") || defaults.prescriptionRequired,
      inStock: searchParams.get("inStock") || defaults.inStock,
      sort: searchParams.get("sort") || defaults.sort,
      page: searchParams.get("page") || defaults.page,
      limit: searchParams.get("limit") || defaults.limit,
    }),
    [searchParams]
  );

  useEffect(() => {
    setDraftQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery !== filters.q) {
      if (debouncedQuery.trim()) {
        next.set("q", debouncedQuery.trim());
      } else {
        next.delete("q");
      }
      next.set("page", "1");
      setSearchParams(next, { replace: true });
    }
  }, [debouncedQuery, filters.q, searchParams, setSearchParams]);

  useEffect(() => {
    dispatch(
      searchMedicines({
        ...filters,
        category: filters.category === "All" ? undefined : filters.category,
        prescriptionRequired: filters.prescriptionRequired === "all" ? undefined : filters.prescriptionRequired,
        inStock: filters.inStock || undefined,
      })
    );
  }, [dispatch, filters]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!next.get("limit")) next.set("limit", defaults.limit);
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setDraftQuery("");
    setSearchParams(new URLSearchParams({ limit: defaults.limit }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Search results</p>
        <h1 className="text-3xl font-black">Browse matching medicines</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {searchResults.total} results{filters.q ? ` for "${filters.q}"` : ""}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">
          <SearchSidebar
            filters={filters}
            draftQuery={draftQuery}
            setDraftQuery={setDraftQuery}
            onChange={updateParams}
            onReset={resetFilters}
            total={searchResults.total}
          />
        </div>

        <div className="space-y-6">
          <div className="lg:hidden">
            <SearchSidebar
              filters={filters}
              draftQuery={draftQuery}
              setDraftQuery={setDraftQuery}
              onChange={updateParams}
              onReset={resetFilters}
              total={searchResults.total}
            />
          </div>

          {searchLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[360px] animate-pulse rounded-[28px] bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : searchResults.items.length ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {searchResults.items.map((medicine) => (
                  <MedicineCard key={medicine._id} medicine={medicine} />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page {searchResults.page} of {searchResults.pages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={searchResults.page <= 1}
                    onClick={() => updateParams({ page: String(searchResults.page - 1) })}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: searchResults.pages }, (_, index) => index + 1)
                    .slice(Math.max(0, searchResults.page - 2), Math.max(3, searchResults.page + 1))
                    .map((page) => (
                      <Button
                        key={page}
                        variant={page === searchResults.page ? "primary" : "secondary"}
                        onClick={() => updateParams({ page: String(page) })}
                      >
                        {page}
                      </Button>
                    ))}
                  <Button
                    variant="secondary"
                    disabled={searchResults.page >= searchResults.pages}
                    onClick={() => updateParams({ page: String(searchResults.page + 1) })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Card className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search className="text-slate-500" />
              </div>
              <h2 className="text-2xl font-black">No results found</h2>
              <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                Try a different medicine name, widen your price range, or clear the active filters.
              </p>
              <Button variant="secondary" onClick={resetFilters}>
                Clear search
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
