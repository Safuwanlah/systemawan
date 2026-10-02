import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlobalProvider } from "@/context/GlobalContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </GlobalProvider>
  );
}
