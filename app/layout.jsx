import "@/styles/globals.css";

export const metadata = {
  title: "Nebula Strike",
  description: "A localStorage-powered space shooter built with Next.js and React."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
