import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { DemoProvider } from "@/components/demo-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JogaMais · Demonstração local",
    template: "%s · JogaMais",
  },
  description:
    "Demonstração local da experiência de acompanhamento esportivo JogaMais.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#19372c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR">
      <body>
        <DemoProvider>
          <AppShell>{children}</AppShell>
        </DemoProvider>
      </body>
    </html>
  );
}
