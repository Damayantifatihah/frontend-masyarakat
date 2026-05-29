import DashboardSection from "@/components/user/dashboard/dashboardSection";
import LaporanFeed from "@/components/user/dashboard/laporanFeed";

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <DashboardSection />

      <LaporanFeed />
    </div>
  );
}