"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalSplashLoader() {
  const pathname = usePathname();

  return <RouteSplash key={pathname} />;
}

function RouteSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <Image
        src="/animations/loading.gif"
        alt="Loading"
        width={120}
        height={120}
        priority
        unoptimized
        className="h-20 w-20 object-contain"
      />
    </div>
  );
}
