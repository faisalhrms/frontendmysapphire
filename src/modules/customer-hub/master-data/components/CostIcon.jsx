import {
  SlidersHorizontal,
  Ruler,
  DollarSign,
  Euro,
  PoundSterling,
  Banknote,
} from "lucide-react";

const SizingCostIcon = ({ active = false, currency = "usd" }) => {
  const cur = (currency || "").toLowerCase();

  const BadgeIcon =
    cur === "eur" ? Euro :
    cur === "gbp" ? PoundSterling :
    cur === "usd" ? DollarSign :
    Banknote;

  return (
    <span
      className={[
        "relative inline-flex w-5 h-5 items-center justify-center rounded-md",
        active ? "bg-sky-50 ring-1 ring-sky-200" : "",
      ].join(" ")}
    >
      <SlidersHorizontal
        className={[
          "relative w-4 h-4",
          active ? "text-sky-600" : "text-slate-600",
        ].join(" ")}
      />

      <span
        className={[
          "absolute -right-1 -bottom-1 inline-flex w-4 h-4 items-center justify-center rounded-full ring-1",
          active
            ? "bg-emerald-100 text-emerald-700 ring-emerald-300"
            : "bg-emerald-50 text-emerald-600 ring-emerald-200",
        ].join(" ")}
      >
        <BadgeIcon className="w-2.5 h-2.5" />
      </span>
    </span>
  );
};

export default SizingCostIcon;
