// components/ui/calendar.tsx
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date?: Date) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  return (
    <div className={className}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        showOutsideDays
        fixedWeeks
        modifiersClassNames={{
          selected: "bg-blue-600 text-white",
          today: "border border-blue-400",
        }}
        classNames={{
          month: "space-y-2",
          caption: "flex justify-center py-2 font-medium",
          nav: "flex items-center",
          nav_button: "mx-1 hover:bg-blue-100 p-1 rounded",
          table: "w-full border-collapse",
          head_row: "flex justify-between",
          head_cell: "text-xs font-semibold text-gray-500 w-8 h-8 flex items-center justify-center",
          row: "flex justify-between",
          cell: "w-8 h-8 text-sm p-1 text-center rounded hover:bg-blue-100",
        }}
      />
    </div>
  );
}
