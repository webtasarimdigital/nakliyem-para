"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/data/mock-db";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export function PublicPageWithSidebar({ children }: Props) {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(authUser || db.getCurrentUser());
    const handleAuthChange = () => {
      setCurrentUser(authUser || db.getCurrentUser());
    };
    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [authUser]);

  // Sadece CUSTOMER rolündeyse sidebar göster
  const isCustomer = mounted && currentUser?.role === "CUSTOMER";

  if (!isCustomer) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <div className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto">
          <CustomerSidebar />
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
