import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { clearFilters, setFilters } from "@/features/medicine/medicineSlice";

export function MedicineFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.medicine.filters);

  return (
    <Card className="grid gap-4 lg:grid-cols-6">
      <div className="relative lg:col-span-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input
          value={filters.search}
          onChange={(event) => dispatch(setFilters({ search: event.target.value }))}
          className="pl-11"
          placeholder="Search medicines, supplements, devices"
        />
      </div>
      <Select value={filters.category} onChange={(event) => dispatch(setFilters({ category: event.target.value }))}>
        {["All", "Tablets", "Syrups", "Capsules", "Personal Care", "Health Devices"].map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>
      <Select
        value={filters.prescriptionRequired}
        onChange={(event) => dispatch(setFilters({ prescriptionRequired: event.target.value }))}
      >
        <option value="all">All products</option>
        <option value="true">Prescription required</option>
        <option value="false">No prescription</option>
      </Select>
      <Select value={filters.sort} onChange={(event) => dispatch(setFilters({ sort: event.target.value }))}>
        <option value="popular">Popular</option>
        <option value="price_asc">Price low to high</option>
        <option value="price_desc">Price high to low</option>
        <option value="newest">Newest</option>
      </Select>
      <div className="flex gap-2">
        <Input
          placeholder="Min"
          value={filters.minPrice}
          onChange={(event) => dispatch(setFilters({ minPrice: event.target.value }))}
        />
        <Input
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(event) => dispatch(setFilters({ maxPrice: event.target.value }))}
        />
      </div>
      <Button variant="secondary" onClick={() => dispatch(clearFilters())}>
        Reset
      </Button>
    </Card>
  );
}
