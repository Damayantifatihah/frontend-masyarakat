import SuperAdminSidebar from "@/components/superadmin/superSideBar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SuperAdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}