"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT_ID, ADS_ENABLED } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  slot: string;
  variant: "in-article" | "display" | "multiplex";
  className?: string;
};

const RESERVED_HEIGHT: Record<Props["variant"], string> = {
  "in-article": "min-h-[300px] md:min-h-[280px]",
  display: "min-h-[300px] md:min-h-[280px]",
  multiplex: "min-h-[400px]",
};

const isDev = process.env.NODE_ENV !== "production";

export default function AdSlot({ slot, variant, className = "" }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (!ADS_ENABLED || isDev) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js blocked or already filled; nothing to recover.
    }
  }, [pathname]);

  if (!ADS_ENABLED || !slot || slot.startsWith("TODO")) return null;

  const height = RESERVED_HEIGHT[variant];

  return (
    <div className={`my-10 ${className}`.trim()}>
      <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Advertisements</p>
      {isDev ? (
        <div
          className={`${height} border border-dashed border-gray-400 dark:border-slate-600 bg-gray-100 dark:bg-slate-800/40`}
          aria-hidden="true"
        />
      ) : (
        <div className={height}>
          {variant === "in-article" ? (
            <ins
              key={pathname}
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={slot}
              data-ad-format="fluid"
              data-ad-layout="in-article"
            />
          ) : variant === "display" ? (
            <ins
              key={pathname}
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={slot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <ins
              key={pathname}
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={ADSENSE_CLIENT_ID}
              data-ad-slot={slot}
              data-ad-format="autorelaxed"
            />
          )}
        </div>
      )}
    </div>
  );
}
