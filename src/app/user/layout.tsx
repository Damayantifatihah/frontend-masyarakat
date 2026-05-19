import Sidebar from "@/components/user/sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}