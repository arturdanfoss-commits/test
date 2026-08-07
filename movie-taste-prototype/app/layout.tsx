import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Taste Lab",
  description: "Прототип сервиса рекомендаций фильмов через выбор между парами.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
