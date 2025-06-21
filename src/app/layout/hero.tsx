import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 bg-gray-100">
      {/* Text content */}
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Book your train tickets <br />
          with <span className="text-red-500">RAILWAYS</span>
        </h1>
        <p className="text-gray-600">
          Book your train tickets
        </p>
        <div className="flex gap-6">  
          <Link href="/booking" className="bg-red-500 text-white uppercase flex items-center gap-2 px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition">
            Book Now 
          </Link>
          <Link href="/learnmore" className="bg-gray-700 text-white flex items-center gap-2 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
            Learn More 
          </Link>
        </div>
      </div>
      {/* Image content */}
      <div className="relative w-full md:w-1/2 h-64 md:h-96 mt-8 md:mt-0">
        <Image
          src="/train.jpeg"
          alt="Train Journey"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </section>
  );
}

