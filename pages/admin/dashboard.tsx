import Head from "next/head";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Welcome, Admin 👋
          </h1>
          <p className="text-gray-500 mb-8">Manage your railway system efficiently</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link href="/admin/stations/station">
              <button className="w-full py-3 rounded-xl bg-blue-400 hover:bg-blue-500 text-white font-semibold shadow-md transition duration-200">
                Station Add / Delete
              </button>
            </Link>

            <Link href="/admin/trainop/train">
              <button className="w-full py-3 rounded-xl bg-indigo-400 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-200">
                Train
              </button>
            </Link>

            <Link href="/admin/schedule">
              <button className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-white font-semibold shadow-md transition duration-200">
                Schedule
              </button>
            </Link>

            <Link href="/admin/passengers">
              <button className="w-full py-3 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold shadow-md transition duration-200">
                Passenger Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

