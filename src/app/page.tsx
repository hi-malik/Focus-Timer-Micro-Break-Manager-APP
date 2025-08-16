import Timer from "@/components/Timer";
import Welcome from "@/components/Welcome";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 flex items-center justify-center">
      <main className="w-full flex flex-col items-center gap-8 max-w-3xl">
        <Welcome />
        <Timer isPremium={false} />
      </main>
    </div>
  );
}
