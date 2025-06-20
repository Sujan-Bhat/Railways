import Head from "next/head";
import Link from "next/link";

export default function TrainManagement() {
  return (
    <>
      <Head>
        <title>Train Management</title>
      </Head>

      <div className="min-h-screen bg-[#ECF0F1] flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
            Train Management 🚆
          </h1>
          <p className="text-[#95A5A6] mb-8">
            Add or remove trains from the system
          </p>

          <div className="flex flex-col space-y-4">
            <Link href="/admin/trainop/add" legacyBehavior>
              <a className="w-full">
                <button className="w-full py-3 rounded-xl bg-[#F39C12] hover:bg-[#e08e0b] text-white font-semibold shadow-md transition duration-200">
                  Add Train
                </button>
              </a>
            </Link>

            <Link href="/admin/trainop/remove" legacyBehavior>
              <a className="w-full">
                <button className="w-full py-3 rounded-xl bg-[#E74C3C] hover:bg-[#c0392b] text-white font-semibold shadow-md transition duration-200">
                  View and Edit Train Details
                </button>
              </a>
            </Link>
          </div>

          <div className="mt-8">
            <Link href="/admin/dashboard">
              <button className="text-sm text-blue-600 hover:underline font-semibold">
                ← Back to Admin Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

