import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call NextAuth signIn function with the Credentials provider
    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password
    });
    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      // Redirect to home page or destination after successful sign in.
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-96">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Sign In
          </h2>
          {errorMessage && (
            <p className="mb-4 text-center text-red-500">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-black text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
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

