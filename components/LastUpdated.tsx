import { getBuildLastModified } from "@/lib/indexing";

/**
 * Visible freshness line (build-time date for SSG; aligns with metadata modifiedTime).
 */
export default function LastUpdated() {
  const date = getBuildLastModified().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <p className="text-sm text-gray-500 dark:text-slate-400 mt-4">
      Last updated: {date}
    </p>
  );
}
