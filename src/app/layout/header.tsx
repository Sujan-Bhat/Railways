import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-md bg-white">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold text-red-500">RAILWAYS</span>
      </Link>
      <nav className="flex items-center gap-6 font-medium text-gray-700">
        <Link href="/" className="hover:text-red-500">
          Home
        </Link>
        <Link href="/train_schedules_for_users" className="hover:text-red-500">
          Schedules
        </Link>
        <Link href="/booking" className="hover:text-red-500">
          Book Tickets
        </Link>
         {/* Added About Us link */}
        <Link href="/about" className="hover:text-red-500">
          About Us
        </Link>
        
        <Link href="/contact" className="hover:text-red-500">
          Contact
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}

