import Sidebar from "@/components/admin/sideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start bg-[#F6F6F8]">
      <Sidebar />

      <main className="flex-1 ">
        {children}
      </main>
    </div>
  );
}