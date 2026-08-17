/// <reference types="vite/client" />

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  mpsjSetGoogleConsent: (options?: { analytics?: boolean; marketing?: boolean }) => void;
}
