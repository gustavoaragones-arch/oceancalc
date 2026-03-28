import type { SVGProps } from "react";

/** Lightweight inline SVGs — no icon library. */

export function IconCalculators(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h5M8 16h8" />
    </svg>
  );
}

export function IconKnots(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 4c-2 0-4 1.5-4 4s2 4 4 4 4-1.5 4-4-2-4-4-4z" />
      <path d="M8 18c0-2 2-3.5 4-3.5s4 1.5 4 3.5" />
      <path d="M12 8v8" />
    </svg>
  );
}

export function IconNavigation(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 10l3-3 3 3" />
    </svg>
  );
}

export function IconWind(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 10h12a2 2 0 100-4H8" />
      <path d="M4 14h16a2 2 0 110 4H10" />
      <path d="M6 18h10a2 2 0 110 4" />
    </svg>
  );
}

export function IconMeasurements(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 8l16-4v12l-16-4V8z" />
      <path d="M8 7.5v9M12 6.5v9M16 5.5v9" />
    </svg>
  );
}

export function IconSailing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M4 20h16" />
      <path d="M12 4v16" />
      <path d="M12 6l8 10H12V6z" />
    </svg>
  );
}
