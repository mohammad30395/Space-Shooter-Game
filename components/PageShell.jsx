import Navbar from "@/components/Navbar";

export default function PageShell({ children, className = "" }) {
  return (
    <div className={`space-bg min-h-dvh overflow-x-hidden text-white ${className}`}>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
