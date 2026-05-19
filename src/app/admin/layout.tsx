import Sidebar from "@/components/admin/sideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F6F6F8]">
      <Sidebar />

      {/* <div className="flex-1 flex flex-col">
        <Topbar /> */}

        <main className="p-6">
          {children}
        </main>
      </div>
    // </div>
  );
}