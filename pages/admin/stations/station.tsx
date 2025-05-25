import Head from "next/head";
import Link from "next/link";

export default function StationManagement() {
  return (
    <>
      <Head>
        <title>Station Management</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-white flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Station Management 🚉
          </h1>
          <p className="text-gray-500 mb-8">Add or remove stations from the system</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href="/admin/stations/add">
              <button className="w-full py-3 rounded-xl bg-green-400 hover:bg-green-500 text-white font-semibold shadow-md transition duration-200">
                Add Station
              </button>
            </Link>

            <Link href="/admin/stations/delete">
              <button className="w-full py-3 rounded-xl bg-red-400 hover:bg-red-500 text-white font-semibold shadow-md transition duration-200">
                Remove Station
              </button>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/admin/dashboard">
              <button className="text-sm text-blue-600 hover:underline">
                ← Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}