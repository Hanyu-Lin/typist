"use client";
import { Loading } from "@/components/loading";
import { AuthLoading, Authenticated } from "convex/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Authenticated>{children}</Authenticated>
      <AuthLoading>
        <Loading />
      </AuthLoading>
    </main>
  );
}
