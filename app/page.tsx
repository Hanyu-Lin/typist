import TimerToolbar from "@/components/toolbar";
import dynamic from "next/dynamic";
const TypingTest = dynamic(
  () => import("@/components/user-typing").then((t) => t.default),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-start p-24 w-screen mx-auto gap-5 animate-fade-in">
      <TimerToolbar />
      <TypingTest />
    </main>
  );
}
