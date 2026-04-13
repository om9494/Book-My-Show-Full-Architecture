import React from "react";
import Navbar from "../components/Navbar";
import BannerCarousel from "../components/BannerCarousel";
import RecommendedMovies from "../components/RecommendedMovies";
import Footer from "../components/Footer";

const Home = () => (
  <div id="home" className="relative min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-50 to-blue-200">
    {/* Hide scrollbar for all browsers */}
    <style>{`
      .scrollbar-hide::-webkit-scrollbar { display: none; }
    `}</style>
    {/* Animated/floating background shapes */}
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-100 opacity-20 rounded-full blur-2xl animate-pulse"></div>
    </div>
    <Navbar />
    <main className="flex-1 flex flex-col gap-8 pt-4 pb-8 px-0 md:px-8">
      <div className="max-w-9xl mx-auto w-full">
        <BannerCarousel />
      </div>
      <div className="max-w-8xl mx-auto w-full mt-4">
        <RecommendedMovies />
      </div>
      {/* Creative, useful, and attractive static content section */}
      <section className="max-w-8xl mx-auto w-full mt-7 px-4 md:px-0">
        <div className="rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 py-12 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-200 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">Why Book With Us?</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <li className="flex items-center gap-4">
                <span className="bg-gradient-to-br from-pink-400 to-red-400 text-white rounded-xl p-3 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 7v9m0 0H7m5 0h5" /></svg>
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-700">Instant Booking</div>
                  <div className="text-gray-500 text-sm">Book your tickets in seconds with real-time seat selection.</div>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-xl p-3 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" /></svg>
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-700">Secure Payments</div>
                  <div className="text-gray-500 text-sm">Your transactions are encrypted and 100% safe.</div>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-xl p-3 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-700">24/7 Support</div>
                  <div className="text-gray-500 text-sm">We’re here to help you anytime, anywhere.</div>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="bg-gradient-to-br from-green-400 to-teal-400 text-white rounded-xl p-3 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-700">Exclusive Offers</div>
                  <div className="text-gray-500 text-sm">Enjoy special discounts and rewards on every booking.</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-8 md:mt-0">
            <div className="w-64 h-64 bg-gradient-to-br from-pink-200 via-blue-200 to-yellow-100 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
              <svg className="w-40 h-40 text-pink-400/60 absolute -top-6 -left-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" /></svg>
              <svg className="w-32 h-32 text-blue-400/40 absolute bottom-0 right-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="8" /></svg>
              <div className="relative z-10 text-center">
                <div className="text-5xl font-extrabold text-pink-500 mb-2">🎬</div>
                <div className="font-bold text-lg text-gray-700">Experience Movies Like Never Before</div>
                <div className="text-gray-500 text-sm mt-2">Seamless, fun, and rewarding movie ticket booking for everyone.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="max-w-8xl mx-auto w-full mt-10 px-4 md:px-0">
        <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl border border-white/30 py-10 px-6 md:px-16 flex flex-col gap-8 relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 text-center drop-shadow-sm">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-100 to-white/80 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center border border-white/40">
              <div className="text-4xl mb-2">🌟</div>
              <div className="font-bold text-lg text-gray-700 mb-1">Amazing Experience!</div>
              <div className="text-gray-500 text-sm mb-2">“Booking tickets is so easy and fast. The UI is beautiful and the offers are great!”</div>
              <div className="text-pink-500 font-semibold">— Priya S.</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-white/80 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center border border-white/40">
              <div className="text-4xl mb-2">🎟️</div>
              <div className="font-bold text-lg text-gray-700 mb-1">Best Movie App</div>
              <div className="text-gray-500 text-sm mb-2">“I love the instant booking and secure payments. Highly recommended!”</div>
              <div className="text-blue-500 font-semibold">— Rahul M.</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-white/80 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center border border-white/40">
              <div className="text-4xl mb-2">💬</div>
              <div className="font-bold text-lg text-gray-700 mb-1">Great Support</div>
              <div className="text-gray-500 text-sm mb-2">“Customer support is always available and super helpful. 5 stars!”</div>
              <div className="text-yellow-500 font-semibold">— Sneha K.</div>
            </div>
          </div>
        </div>
      </section>
      {/* App Download Section
      <section className="max-w-8xl mx-auto w-full mt-10 px-4 md:px-0">
        <div className="rounded-3xl bg-gradient-to-br from-pink-200/60 via-blue-200/60 to-yellow-100/60 shadow-xl border border-white/30 py-10 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 drop-shadow-sm">Get Our App</h2>
            <div className="text-gray-600 text-base mb-4">Book tickets on the go! Download our app for the best experience, exclusive offers, and instant notifications.</div>
            <div className="flex gap-4">
              <a href="#" className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-gray-800 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.564 13.271c-.045-2.381 1.949-3.522 2.037-3.574-1.111-1.623-2.837-1.846-3.448-1.87-1.468-.149-2.868.857-3.616.857-.747 0-1.899-.837-3.127-.814-1.606.024-3.09.934-3.917 2.373-1.672 2.899-.427 7.181 1.202 9.537.797 1.151 1.747 2.444 2.995 2.398 1.207-.048 1.663-.775 3.123-.775 1.46 0 1.862.775 3.128.75 1.297-.025 2.114-1.164 2.906-2.316.457-.668.646-1.017 1.012-1.782-2.661-1.017-3.073-3.956-3.119-4.143zm-2.98-7.646c.662-.803 1.11-1.922.987-3.025-.953.038-2.104.634-2.789 1.437-.613.713-1.153 1.852-.949 2.94 1.062.082 2.089-.539 2.751-1.352z"/></svg>
                <span>App Store</span>
              </a>
              <a href="#" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3.654 2.978c-.232.232-.232.607 0 .839l16.529 16.529c.232.232.607.232.839 0 .232-.232.232-.607 0-.839l-16.529-16.529c-.232-.232-.607-.232-.839 0zm.707 2.121l2.121 2.121 2.121-2.121-2.121-2.121-2.121 2.121zm2.828 2.828l2.121 2.121 2.121-2.121-2.121-2.121-2.121 2.121zm2.828 2.828l2.121 2.121 2.121-2.121-2.121-2.121-2.121 2.121zm2.828 2.828l2.121 2.121 2.121-2.121-2.121-2.121-2.121 2.121zm2.828 2.828l2.121 2.121 2.121-2.121-2.121-2.121-2.121 2.121z"/></svg>
                <span>Google Play</span>
              </a>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src="https://cdn.pixabay.com/photo/2017/01/10/19/05/mobile-1965664_1280.png" alt="App Preview" className="w-56 h-56 object-contain drop-shadow-2xl rounded-2xl" />
          </div>
        </div>
      </section> */}
      {/* FAQ Section */}
      <section className="max-w-8xl mx-auto w-full mt-10 px-4 md:px-0">
        <div className="rounded-3xl bg-white/90 backdrop-blur-md shadow-xl border border-white/30 py-10 px-6 md:px-16 flex flex-col gap-8 relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 text-center drop-shadow-sm">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="font-bold text-lg text-gray-700 mb-1">How do I book a ticket?</div>
              <div className="text-gray-500 text-sm mb-4">Simply select your movie, choose your seats, and proceed to payment. Your ticket will be instantly confirmed!</div>
              <div className="font-bold text-lg text-gray-700 mb-1">Can I cancel or refund my ticket?</div>
              <div className="text-gray-500 text-sm mb-4">Yes, you can cancel your ticket from your profile page before the showtime. Refunds are processed as per our policy.</div>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-700 mb-1">Is my payment secure?</div>
              <div className="text-gray-500 text-sm mb-4">Absolutely! We use industry-standard encryption and never store your card details.</div>
              <div className="font-bold text-lg text-gray-700 mb-1">How do I contact support?</div>
              <div className="text-gray-500 text-sm mb-4">You can reach us 24/7 via the support chat or email listed in the app and website footer.</div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Home;