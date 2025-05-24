import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-right text-base flex flex-col md:flex-row justify-end items-center gap-2 md:gap-4">
        <p>Designed by Sharan and Sujan</p>
        <span className="hidden md:inline">|</span>
        <Link href="/admin" className="hover:underline hover:text-gray-400">
          Admin
        </Link>
        <span className="hidden md:inline">|</span>
        <p>© All rights reserved</p>
      </div>
    </footer>
  );
}

