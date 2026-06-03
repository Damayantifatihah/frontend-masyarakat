import Sidebar from "@/components/admin/sideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F6F6F8]">
      <Sidebar />

      <main className="flex-1 p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}