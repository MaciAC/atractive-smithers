import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp 3',
  description: 'WhatsApp 3 application',
};

export default function WhatsApp3Page() {
  return (
    <main className="py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
            <div style={{ height: '75vh', maxHeight: '75vh' }}>
              <iframe
                src="/w3/index.html"
                style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                title="WhatsApp 3 Application"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
        </div>
      </div>
    </main>
  );
}