import type { Metadata } from "next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL("https://track-articulate-act.github.io");

  return {
    metadataBase,
    title: "Track, Articulate, Act Generating Articulation from Casual Human Videos",
    description: "Reconstructing articulated objects from human videos and replaying their interactions with simulated human and Allegro robot hands.",
    keywords: ["articulated objects", "human video", "real-to-sim", "3D point tracking", "robot manipulation"],
    authors: [
      { name: "Jiaming Zhang" },
      { name: "Homanga Bharadhwaj" },
    ],
    creator: "Jiaming Zhang and Homanga Bharadhwaj",
    icons: {
      icon: "/assets/b3lablogo.png",
      shortcut: "/assets/b3lablogo.png",
    },
    openGraph: {
      title: "Track, Articulate, Act Generating Articulation from Casual Human Videos",
      description: "Reconstructing articulated objects and hand–object interactions from casual human videos.",
      type: "website",
      images: [{
        url: "/assets/social-preview-v2.png",
        width: 1200,
        height: 630,
        alt: "Original laptop video, recovered articulated laptop, and Allegro hand simulation from Track, Articulate, Act.",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Track, Articulate, Act Generating Articulation from Casual Human Videos",
      description: "Reconstructing articulated objects and hand–object interactions from casual human videos.",
      images: ["/assets/social-preview-v2.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
