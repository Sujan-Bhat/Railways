import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Signup: React.FC = () => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = {
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      fullname: (form.elements.namedItem("fullname") as HTMLInputElement).value,
      dob: (form.elements.namedItem("dob") as HTMLInputElement).value,
      gender: (form.elements.namedItem("gender") as HTMLSelectElement).value,
      address: (form.elements.namedItem("address") as HTMLTextAreaElement).value,
      aadhaar: (form.elements.namedItem("aadhaar") as HTMLInputElement).value,
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.status === 409) {
        // User already exists
        setStatusMessage(data.message || "User already exists");
        setMessageColor("text-red-500");
        // Wait 3 seconds then redirect to sign-in page
        setTimeout(() => router.push("/login"), 3000);
      } else if (response.ok) {
        // Account created successfully
        setStatusMessage("Account created successfully");
        setMessageColor("text-green-500");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        // Handle any other errors
        setStatusMessage("An error occurred. Please try again.");
        setMessageColor("text-red-500");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setStatusMessage("An error occurred. Please try again.");
      setMessageColor("text-red-500");
    }
  };

  return (
    <>
      <Head>
        <title>SIGN UP</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-[500px] animate-fadeIn">
          <h1 className="text-center text-black mb-6 text-3xl font-bold animate-slideInDown">
            Create Account
          </h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-black">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                maxLength={15}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-black">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <div>
              <label htmlFor="fullname" className="block text-sm font-semibold text-black">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-black">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-black">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-black">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              ></textarea>
            </div>

            <div>
              <label htmlFor="aadhaar" className="block text-sm font-semibold text-black">
                Aadhaar Number
              </label>
              <input
                type="text"
                id="aadhaar"
                name="aadhaar"
                maxLength={12}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded-lg shadow-lg transition duration-300"
            >
              Create Account
            </button>
          </form>

          {/* Display the message inside the page */}
          {statusMessage && (
            <p className={`mt-4 text-center text-lg font-semibold ${messageColor}`}>
              {statusMessage}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Signup;

