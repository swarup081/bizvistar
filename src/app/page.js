import Link from 'next/link';

export default function Home() {
  return (
    <main>
    
      {/* Add other sections here */}
      <Link href="/get-started">
            <button
                      
                            className="px-8 py-3 bg-blue-500 text-white font-semibold text-lg rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                    
            >
              Continue
            </button>
          </Link>
    </main>
  );
}