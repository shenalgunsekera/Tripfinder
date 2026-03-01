import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
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
