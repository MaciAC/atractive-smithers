'use client'


export default function KaraokeEteriPage() {
  const handleOpenStandalone = () => {
    window.open('/karaoke-eteri/index.html', '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="container mx-auto px-4">
      <div className="overflow-hidden rounded-lg shadow-md">
        {/* Relative container for positioning button */}
        <div
          style={{
            position: 'relative',
            height: '85vh',
            maxHeight: '85vh',
            width: '100%',
          }}
        >
          {/* Button overlay in top-right */}
          <button
            onClick={handleOpenStandalone}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
              padding: '0.5rem 1rem',
              backgroundColor: '#5f6367ff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
              opacity: 0.9,
            }}
          >
            Obre'l ⤴
          </button>

          {/* Iframe underneath */}
          <iframe
            src="/karaoke-eteri/index.html"
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              border: 'none',
            }}
            title="Karaoke Eteri Application"
            allow="fullscreen"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}
