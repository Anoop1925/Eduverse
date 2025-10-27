import React from "react";
import { Cover } from "./cover";
import { Button } from "@/components/ui/button";

export default function CoverDemo() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 mb-8 relative z-20 py-6 text-white">
        Jahaan AI mile padhai se — wahi banenge <Cover>Padhai Waale!</Cover>
      </h1>
      <Button
        className="mt-2 px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        onClick={() => window.location.href = "/auth"}
      >
        Start your AI learning journey now
      </Button>
    </div>
  );
} 