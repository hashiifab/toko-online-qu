import { useState } from "react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <img src="logo.png" alt="Nusatoys" className="h-8" />
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Koleksi
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Tentang Kami
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Edukasi & Blog
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Kontak
              </a>
            </div>

            {/* Desktop Right Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Masuk/Daftar
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </a>
            </div>

            {/* Mobile Right: Cart + Burger */}
            <div className="flex items-center space-x-4 md:hidden">
              {/* Cart always visible */}
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </a>

              {/* Hamburger menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Koleksi
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Tentang Kami
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Edukasi & Blog
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Kontak
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Masuk/Daftar
              </a>
            </div>
          </div>
        )}
      </header>
      {/* Main Content */}
      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              ✨ Mainan Edukasi Premium
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Investasi Terbaik <br />
              untuk Masa <br />
              Depan Anak <br />
              Anda
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Kembangkan logika, kreativitas, dan keterampilan teknis melalui
              mainan edukasi pilihan yang telah dipercaya ribuan keluarga
              Indonesia.
            </p>
            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-4 w-full">
              <button className="w-full sm:w-auto bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center">
                Jelajahi Koleksi Kami
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <button className="w-full sm:w-auto bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Lihat Video Demo
              </button>
            </div>

            {/* Statistik */}
            <div className="mt-12 flex flex-row items-center justify-center sm:justify-start gap-4 sm:gap-8 text-center overflow-x-auto">
              <div className="flex flex-col items-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  10K+
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Keluarga Puas
                </p>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  500+
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Produk Premium
                </p>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center">
                  4.9
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 ml-1 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Rating Pelanggan
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="hero.png"
              alt="Anak-anak bermain"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-semibold">Sertifikat SNI</span>
            </div>
          </div>
        </section>
        {/* Value Proposition Section */}
        <section className="bg-gray-100 py-12 sm:py-16 lg:py-24 mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center my-12">
              Mengapa Mainan Edukasi?
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-light text-center mb-12">
              Berdasarkan penelitian terbaru, mainan edukasi terbukti
              meningkatkan kemampuan kognitif anak hingga 40% lebih efektif
              dibanding metode pembelajaran konvensional.
            </p>

            {/* Flex container untuk cards */}
            <div className="flex flex-col sm:flex-col md:flex-row md:justify-between gap-6 md:gap-8 lg:gap-10">
              {/* Card 1 */}
              <div className="flex-1 min-w-full md:min-w-[30%] bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300">
                {/* Icon + Content */}
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 sm:mb-6">
                  {/* Brain Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 sm:w-8 h-6 sm:h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75V14.25a3 3 0 003 3h.75a3 3 0 003-3V12.75a3 3 0 00-3-3H19.5a3 3 0 00-3 3zm0-7.5V7.5a3 3 0 003 3h.75a3 3 0 003-3V5.25a3 3 0 00-3-3H19.5a3 3 0 00-3 3zM7.5 12.75V14.25a3 3 0 003 3h.75a3 3 0 003-3V12.75a3 3 0 00-3-3H10.5a3 3 0 00-3 3zm0-7.5V7.5a3 3 0 003 3h.75a3 3 0 003-3V5.25a3 3 0 00-3-3H10.5a3 3 0 00-3 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center">
                  Problem Solving
                </h3>
                <p className="text-gray-500 text-sm sm:text-base text-center">
                  Mengasah kemampuan berpikir logis dan analitis melalui
                  tantangan yang menyenangkan dan terstruktur.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex-1 min-w-full md:min-w-[30%] bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4 sm:mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 sm:w-8 h-6 sm:h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 3.75h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center">
                  Kreativitas & Inovasi
                </h3>
                <p className="text-gray-500 text-sm sm:text-base text-center">
                  Membangun imajinasi dan kemampuan berpikir out-of-the-box
                  untuk menghadapi tantangan masa depan.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex-1 min-w-full md:min-w-[30%] bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 sm:p-8 flex flex-col items-center transform transition-all duration-300">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 sm:mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 sm:w-8 h-6 sm:h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center">
                  Keterampilan STEM
                </h3>
                <p className="text-gray-500 text-sm sm:text-base text-center">
                  Memperkenalkan konsep Science, Technology, Engineering, dan
                  Mathematics sejak dini dengan cara yang menyenangkan.
                </p>
              </div>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
};

export default HomePage;
