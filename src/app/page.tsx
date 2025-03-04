"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MaternityPackages } from "@/components/core/maternity-packages";
import { CenterPage } from "@/components/core/center-pages";

const sidebarItems = [
  { id: "maternity", label: "Maternity Packages" },
  { id: "center", label: "Center Page" },
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePage = searchParams.get("tab") || "maternity";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      router.replace("?tab=maternity");
    }
  }, [router, searchParams]);

  const handleTabChange = (id: string) => {
    router.push(`?tab=${id}`, { scroll: false });
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#F2ECDE] text-[#303030] p-4 flex flex-col space-y-2">
        <h1 className="text-xl font-bold mb-4">StrapifyX</h1>
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activePage === item.id ? "default" : "ghost"}
            className="w-full text-left"
            onClick={() => handleTabChange(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#F9F4E7]">
        {activePage === "maternity" && <MaternityPackages />}
        {activePage === "center" && <CenterPage />}
      </main>
    </div>
  );
}
