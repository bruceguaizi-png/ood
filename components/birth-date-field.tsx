"use client";

import { useState } from "react";

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

type DateParts = {
  year: string;
  month: string;
  day: string;
};

function parseDateParts(value: string): DateParts {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { year: "", month: "", day: "" };
  }

  const [year = "", month = "", day = ""] = value.split("-");
  return { year, month, day };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function normalizeDay(value: string) {
  if (!value) return "";
  return value.replace(/\D/g, "").slice(0, 2);
}

function normalizeYear(value: string) {
  if (!value) return "";
  return value.replace(/\D/g, "").slice(0, 4);
}

function toIsoDate(parts: DateParts) {
  if (!parts.year || !parts.month || !parts.day) return "";
  const paddedDay = parts.day.padStart(2, "0");
  return `${parts.year}-${parts.month}-${paddedDay}`;
}

export function isValidBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const { year, month, day } = parseDateParts(value);
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);

  if (!numericYear || !numericMonth || !numericDay) return false;
  if (numericMonth < 1 || numericMonth > 12) return false;
  if (numericDay < 1 || numericDay > daysInMonth(numericYear, numericMonth)) return false;
  return true;
}

export function BirthDateField(props: {
  value: string;
  onChange: (value: string) => void;
  yearName?: string;
  monthName?: string;
  dayName?: string;
}) {
  const [parts, setParts] = useState<DateParts>(() => parseDateParts(props.value));

  function update(next: Partial<DateParts>) {
    setParts((current) => {
      const nextParts = {
        ...current,
        ...next,
      };
      props.onChange(toIsoDate(nextParts));
      return nextParts;
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr_1fr]">
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-stone-400">Month</span>
        <select
          name={props.monthName ?? "birthMonth"}
          value={parts.month}
          onChange={(event) => update({ month: event.target.value })}
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        >
          <option value="">Month</option>
          {months.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-stone-400">Day</span>
        <input
          name={props.dayName ?? "birthDay"}
          inputMode="numeric"
          autoComplete="bday-day"
          maxLength={2}
          value={parts.day}
          onChange={(event) => update({ day: normalizeDay(event.target.value) })}
          placeholder="17"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-stone-400">Year</span>
        <input
          name={props.yearName ?? "birthYear"}
          inputMode="numeric"
          autoComplete="bday-year"
          maxLength={4}
          value={parts.year}
          onChange={(event) => update({ year: normalizeYear(event.target.value) })}
          placeholder="1998"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      </label>
    </div>
  );
}
