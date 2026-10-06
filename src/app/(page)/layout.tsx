import type { ReactNode } from "react";
import DashboardLayout from "../(component)/dashboard-layout/dashboard-layout";

export default function PageLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
