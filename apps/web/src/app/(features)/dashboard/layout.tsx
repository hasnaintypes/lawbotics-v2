"use client";

import { SyncUserOnLoad } from "@/components/feature-pages/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SyncUserOnLoad />
      {children}
    </>
  );
}
