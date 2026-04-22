import { ADS_ENABLED } from "@/lib/ads";

type Props = {
  label?: string;
};

export default function AdPlaceholder({ label = "Ad space" }: Props) {
  if (!ADS_ENABLED) {
    return (
      <div className="my-6 w-full rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-4 text-center">
        <p className="text-xs text-gray-400">
          {label}
        </p>
      </div>
    );
  }

  return null;
}
