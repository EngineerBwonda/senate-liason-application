import type { ReactNode } from "react";
import DashboardLayout from "../../(component)/dashboard-layout/dashboard-layout";

export default function BoardDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
