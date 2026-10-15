
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifySession() {
      try {
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        setChecking(false);
      } catch {
        router.replace("/login");
      }
    }

    void verifySession();
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Checking admin session...</p>
      </main>
    );
  }

  return children;
}
