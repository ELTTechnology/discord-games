"use client";
import { Lobby } from "@/components/lobby/Lobby";
import { patchUrlMappings } from "@discord/embedded-app-sdk";
import { useEffect } from "react";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Home() {
  useEffect(() => {
    patchUrlMappings([
      {
        prefix: "/api/socket/",
        target: "https://word-riot.onrender.com/api/socket/",
      },
    ]);
  }, []);

  return (
    <div
      className={`${roboto.className} w-dvw h-dvh flex justify-center items-center bg-slate-800`}
    >
      <Lobby />
    </div>
  );
}
