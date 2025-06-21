"use client";

import Head from "next/head";
import Header from "../src/app/layout/header";
import Footer from "../src/app/layout/footer";

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us - Train Booking System</title>
      </Head>
      <Header />
      <main className="min-h-screen bg-[#ECF0F1] py-10 px-4 sm:px-6 lg:px-8 text-[#2C3E50]">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-extrabold text-center">About Us</h1>
          
          <section className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-lg">
              The Train Booking System project is designed to simplify and streamline the process
              of booking train tickets by integrating modern web development techniques, robust
              backend services, and an intuitive user interface. Our solution features real-time
              schedule querying, dynamic fare calculation, secure user authentication, and comprehensive
              booking management.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Journey</h2>
            <p className="text-lg">
              Through countless hours of planning, coding, and testing, we have built a system that
              not only meets the current demands for an efficient ticketing operation but also lays the
              foundation for future enhancements like payment integration, detailed reporting.
              Our system exemplifies the convergence of solid technical architecture and
              an inviting user experience.
            </p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <p className="text-lg font-bold">Sujan Bhat</p>
              </div>
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <p className="text-lg font-bold">Sharan U</p>
              </div>
            </div>
          </section>
          
         
        </div>
      </main>
      <Footer />
    </>
  );
}

