import React from "react";
import Head from "next/head";

const Signup: React.FC = () => {
  return (
    <>
      <Head>
        <title>SIGN UP</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f0] via-[#ffe3c1] to-[#ffe8cc] font-sans">
        <div className="w-[90%] max-w-xl p-10 rounded-[18px] shadow-[0_12px_30px_rgba(255,111,0,0.25)] bg-gradient-to-br from-white to-[#fff5e6] animate-fadeIn">
          <h1 className="text-center text-[#ff6f00] mb-9 text-[34px] font-bold tracking-wide shadow-sm animate-slideInDown">
            Welcome to Indian Railways
          </h1>

          <form className="flex flex-col gap-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                maxLength={15}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              />
            </div>

            <div>
              <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              ></textarea>
            </div>

            <div>
              <label htmlFor="aadhaar" className="block text-sm font-semibold text-gray-700">
                Aadhaar Number
              </label>
              <input
                type="text"
                id="aadhaar"
                name="aadhaar"
                maxLength={12}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#fffefc]"
              />
            </div>

            <button
              type="submit"
              className="w-full p-4 bg-gradient-to-br from-[#ff6f00] to-[#ffa726] text-white font-bold rounded-lg shadow-lg hover:from-[#e65c00] hover:to-[#fb8c00] transform hover:scale-105 transition duration-300"
            >
              Create Account
            </button>
          </form>
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