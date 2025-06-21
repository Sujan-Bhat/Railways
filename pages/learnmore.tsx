"use client"; // if using Next.js 13 with the app directory, otherwise remove this line

import Head from "next/head";
import Header from "../src/app/layout/header";
import Footer from "../src/app/layout/footer";

export default function LearnMorePage() {
  return (
    <>
      <Head>
        <title>Learn More - Train Booking System</title>
      </Head>
      <Header />
      <main className="min-h-screen bg-[#ECF0F1] py-10 px-4 text-[#2C3E50]">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Learn More About the Train Booking System
          </h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-lg leading-relaxed mb-4">
              The Train Booking System is a comprehensive web application
              designed to streamline the process of booking and managing train
              tickets. It integrates features such as user authentication, real‐time
              fare calculation, schedule querying, and secure booking transactions,
              all presented within a responsive and user‐friendly interface.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Core Features</h2>
            <ul className="list-disc ml-6 text-lg space-y-2">
              <li>
                <strong>User Authentication:</strong> Secure login and session management 
                using NextAuth.
              </li>
              <li>
                <strong>Route & Schedule Retrieval:</strong> Dynamic querying of train routes, with detailed
                departure and arrival timings fetched from train schedule data.
              </li>
              <li>
                <strong>Dynamic Fare Calculation:</strong> Automatic calculation of total fare based on 
                the number of passengers and ticket rates.
              </li>
              <li>
                <strong>Booking Management:</strong> Creation, viewing, and cancellation of bookings
                with transactional integrity.
              </li>
              <li>
                <strong>Responsive Design:</strong> User interface designed with Next.js and Tailwind CSS,
                providing a seamless experience across devices.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-lg leading-relaxed mb-4">
              The system is built with Next.js to combine server-side rendering with client-side
              interactivity. The backend is implemented using Node.js with Next.js API routes and connects
              to a MySQL database using a robust connection pooling mechanism. Authentication is managed
              with NextAuth, ensuring secure session management. Key transactions, such as booking creation
              and cancellation, are executed within database transactions to guarantee consistency.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Flow & Processes</h2>
            <p className="text-lg leading-relaxed mb-4">
              Upon entering a route and journey date, the frontend sends a request to search for available
              trains. The backend processes this query by joining the relevant schedule and routes tables,
              returning data such as departure and arrival times. Once a user selects a train, the system
              calculates the total fare in real time and, upon confirmation, creates booking records along
              with passenger entries. Ticket cancellations are handled gracefully, updating booking statuses
              based on remaining passengers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Future Enhancements</h2>
            <p className="text-lg leading-relaxed mb-4">
              Future improvements for the Train Booking System include integration with payment gateways for
              online transactions, implementing advanced search filters and recommendations, real-time seat allocation,
              and further optimizing performance for high concurrent user loads.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Acknowledgments</h2>
            <p className="text-lg leading-relaxed">
              This project leverages modern web technologies including Next.js, NextAuth, Tailwind CSS, Node.js, and MySQL.
              Special thanks to the robust documentation and active communities behind these technologies, which have
              been invaluable in developing a scalable and efficient train booking system.
            </p>
          </section>
          
        </div>
      </main>
      <Footer />
    </>
  );
}

