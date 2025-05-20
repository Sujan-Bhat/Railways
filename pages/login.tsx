import React from "react";
import Head from "next/head";
import Link from "next/link";

// pages/login.tsx
export default function Login() {
  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white">
        {/* Added w-96 here to increase the width of the card */}
        <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-96">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Sign In
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-black text-sm font-bold mb-2"
              >
                Username/phone number 
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your username"
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-black text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Your password"
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-black">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}


