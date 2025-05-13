"use client";

export default function Info() {
  return (
    <main className="py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">V1.0.0</h2>
                <span className="text-gray-400">Última actualització: {new Date().toLocaleDateString('ca-ES')}</span>
              </div>
              <div className="text-gray-300 space-y-4">
                <p> Imagina que demà en Mr meta decideix tancar Instagram. O pitjor encara, tancar atractive_smithers...</p>
                <p> Aquí pots buscar tot el material d&apos;atractive_smithers sense que ningú et vigili.</p>
                <p> De moment falten ~50 posts i molts comentaris, els reels encara no es poden reproduïr.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}