"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if a click occurs outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <Link href="/about" className="hover:text-red-500">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-red-500">
          Contact
        </Link>
        {session ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="px-4 py-2 bg-transparent text-red-500 font-bold rounded-full focus:outline-none"
            >
              {session.user?.name}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
                <Link
                  href="/details"
                  className="block px-4 py-2 hover:bg-red-100"
                >
                  Details
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

