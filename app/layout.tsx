import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Freightline | Shipment overview", description: "A logistics dashboard demonstration using synthetic shipment data." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
