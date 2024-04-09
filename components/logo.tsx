import { Keyboard } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Keyboard className="w-12 h-12" />
      <p className="font-extrabold text-4xl">Typist</p>
    </div>
  );
};
