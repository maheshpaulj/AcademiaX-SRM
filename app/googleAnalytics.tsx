"use client";

import { useEffect } from "react";

// Extend the Window interface to include the gtag property
declare global {
  interface Window {
    gtag?: (...args: [string, string, Record<string, unknown>?]) => void;
  }
}
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_TRACKING_ID = "G-59BZ9QH491";

export default function GoogleAnalytics() {
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);
  useEffect(() => {
    const handleOutboundClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (
        target &&
        window.gtag &&
        target.tagName === "A" &&
        target.href.startsWith("https://")
      ) {
        window.gtag("event", "outbound_click", {
          event_category: "Outbound",
          event_label: target.href,
        });
      }
    };

    document.addEventListener("click", handleOutboundClick);
    return () => document.removeEventListener("click", handleOutboundClick);
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
