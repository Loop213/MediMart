import { Filter } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function SearchSidebar({ filters, draftQuery, setDraftQuery, onChange, onReset, total }) {
  return (
    <Card className="sticky top-24 space-y-5 p-5">
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-brand-600" />
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Search term</p>
        <Input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Search medicines" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Category</p>
        <Select value={filters.category} onChange={(event) => onChange({ category: event.target.value, page: "1" })}>
          {["All", "Tablets", "Syrups", "Capsules", "Health Devices"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Sort by</p>
        <Select value={filters.sort} onChange={(event) => onChange({ sort: event.target.value, page: "1" })}>
          <option value="popular">Popular</option>
          <option value="price_asc">Price Low to High</option>
          <option value="price_desc">Price High to Low</option>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Min price</p>
          <Input
            type="number"
            value={filters.minPrice}
            onChange={(event) => onChange({ minPrice: event.target.value, page: "1" })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Max price</p>
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={(event) => onChange({ maxPrice: event.target.value, page: "1" })}
            placeholder="5000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Prescription</p>
        <Select
          value={filters.prescriptionRequired}
          onChange={(event) => onChange({ prescriptionRequired: event.target.value, page: "1" })}
        >
          <option value="all">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>
      </div>

      <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-700">
        In stock only
        <input
          type="checkbox"
          checked={filters.inStock === "true"}
          onChange={(event) => onChange({ inStock: event.target.checked ? "true" : "", page: "1" })}
        />
      </label>

      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {total} matching medicines
      </div>

      <Button variant="secondary" className="w-full" onClick={onReset}>
        Clear filters
      </Button>
    </Card>
  );
}
