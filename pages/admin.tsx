import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Generate CAPTCHA only on client side
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 7);
  }

  const handleLogin = () => {
    setError("");

    if (!adminId || !password || !captchaInput) {
      setError("Please fill in all fields.");
      return;
    }

    if (captchaInput !== captcha) {
      setError("Invalid CAPTCHA.");
      setCaptcha(generateCaptcha()); // Refresh CAPTCHA
      setCaptchaInput(""); // Clear input
      return;
    }

    if (adminId === "admin" && password === "admin") {
      router.push("/dashboard"); // Navigate to the next page
    } else {
      setError("Invalid ID or password.");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p>
                CAPTCHA: <strong>{captcha}</strong>
              </p>
              <button
                onClick={() => {
                  setCaptcha(generateCaptcha());
                  setCaptchaInput("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter CAPTCHA"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
