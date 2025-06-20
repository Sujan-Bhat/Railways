import Head from "next/head";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Admin Dashboard - Modern Railway System</title>
      </Head>

      <div className="min-h-screen bg-[#ECF0F1] flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
            Welcome, Admin 👋
          </h1>
          <p className="text-[#95A5A6] mb-8">
            Manage the railway system 
          </p>

          <div className="flex flex-col space-y-4">
            <Link href="/admin/stations/station" legacyBehavior>
              <a className="w-full">
                <button className="w-full py-3 rounded-xl bg-[#F39C12] hover:bg-[#e08e0b] text-white font-semibold shadow-md transition duration-200">
                  Manage Stations
                </button>
              </a>
            </Link>

            <Link href="/admin/trainop/train" legacyBehavior>
              <a className="w-full">
                <button className="w-full py-3 rounded-xl bg-[#F39C12] hover:bg-[#e08e0b] text-white font-semibold shadow-md transition duration-200">
                  Manage Trains
                </button>
              </a>
            </Link>

            <Link href="/admin/schedule/schedule_main" legacyBehavior>
              <a className="w-full">
                <button className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-white font-semibold shadow-md transition duration-200">
                  View Schedules
                </button>
              </a>
            </Link>

            <Link href="/admin/passenger/passengerdetail" legacyBehavior>
              <a className="w-full">
                <button className="w-full py-3 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold shadow-md transition duration-200">
                  View Passenger Details
                </button>
              </a>
            </Link>
          </div>

          <div className="mt-8">
            <Link href="/" legacyBehavior>
              <a className="text-sm text-blue-600 hover:underline font-semibold">
                ← Back to User Dashboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}


