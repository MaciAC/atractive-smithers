"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="py-4">
      <div className="container">
        <div className="mx-auto mt-8">
          <div className="flex flex-col gap-4 justify-end items-end">
            <Link href="/buscali" className="group">
              <div className="bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:bg-gray-700 hover:scale-105">
                <h2 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">
                Atractive Sniffer
                </h2>
              </div>
            </Link>

            <Link href="/foros" className="group">
              <div className="bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:bg-gray-700 hover:scale-105">
                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Atractive Speaker
                </h2>
              </div>
            </Link>

            <Link href="/numbrus" className="group">
              <div className="bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:bg-gray-700 hover:scale-105">
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                Atractive Stats
                </h2>
              </div>
            </Link>
            <Link href="/info" className="group">
              <div className="bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:bg-gray-700 hover:scale-105">
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                Atractive Info
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}