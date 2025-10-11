import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parse } from "date-fns";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
}

const MonthSelector = ({ selectedMonth, onMonthChange, availableMonths }: MonthSelectorProps) => {
  return (
    <Select value={selectedMonth} onValueChange={onMonthChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>
          {format(parse(selectedMonth, "yyyy-MM", new Date()), "MMMM yyyy")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableMonths.map((month) => (
          <SelectItem key={month} value={month}>
            {format(parse(month, "yyyy-MM", new Date()), "MMMM yyyy")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
