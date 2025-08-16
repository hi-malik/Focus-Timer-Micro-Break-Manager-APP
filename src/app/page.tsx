import Timer from "@/components/Timer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 flex items-center justify-center">
      <main className="w-full flex flex-col items-center gap-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">Focus Timer & Micro‑Break Manager</h1>
        <p className="text-center opacity-80 max-w-xl">
          Stay in deep work with timed focus sessions and restorative micro‑breaks. Configure durations, start the timer, and let us handle the rhythm.
        </p>
        <Timer isPremium={false} />
      </main>
    </div>
  );
}
