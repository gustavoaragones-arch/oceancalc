type Props = {
  label?: string;
};

/**
 * Reserved insertion point for a future manual ad unit. Renders nothing —
 * Google Auto Ads (loaded globally in app/layout.tsx) is the live ad
 * system, and no manual unit exists yet. ADS_ENABLED (lib/ads.ts) remains
 * the flag a future manual implementation would gate on.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AdPlaceholder({ label }: Props) {
  return null;
}
