import { site } from "@/config/siteOwner";

interface AuthorPublisherProps {
  lastUpdated?: string;
  className?: string;
}

export function AuthorPublisher({ lastUpdated, className = "" }: AuthorPublisherProps) {
  return (
    <div className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>
      <p>
        Author: {site.author} · Publisher: {site.publisher}
      </p>
      {lastUpdated && (
        <p>Last updated: {lastUpdated}</p>
      )}
    </div>
  );
}
