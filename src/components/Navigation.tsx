import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center gap-8 mb-8">
      <Link
        href="/"
        className={`text-lg font-medium transition-colors ${
          pathname === '/buscali'
            ? 'text-pink-500'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Atractive posts
      </Link>
      <Link
        href="/stats"
        className={`text-lg font-medium transition-colors ${
          pathname === '/numbrus'
            ? 'text-pink-500'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Atractive stats
      </Link>
      <Link
        href="/comments"
        className={`text-lg font-medium transition-colors ${
          pathname === '/foros'
            ? 'text-pink-500'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Atractive comentaris
      </Link>
    </nav>
  );
}