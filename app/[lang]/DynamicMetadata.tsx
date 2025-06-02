// components/DynamicMetadata.tsx
"use client";

import { useEffect } from "react";
import Head from "next/head";
import { siteConfig } from "@/config/site";

export default function DynamicMetadata() {
  useEffect(() => {
    // Dynamically update the title for the document
    const updatedTitle = siteConfig.name;
    document.title = updatedTitle;
  }, []);

  return (
    <Head>
      {/* Meta Tags */}
      <meta name="description" content={siteConfig.description} />
      <meta property="og:title" content={siteConfig.name} />

      {/* Favicon links */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        href="/web-app-manifest-192x192.png"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="/web-app-manifest-192x192.png"
        sizes="16x16"
      />

      {/* Apple Touch Icon for iOS */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Optional: Add a meta tag for MS tile image for Windows */}
      <meta name="msapplication-TileImage" content="/favicon-144x144.png" />

      {/* You can add other dynamic metadata here */}
    </Head>
  );
}
