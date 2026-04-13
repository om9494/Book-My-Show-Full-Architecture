import React from "react";

const banners = [
  "https://img.freepik.com/free-vector/online-cinema-banner-with-open-clapper-board-film-strip_1419-2242.jpg?semt=ais_hybrid&w=740",
  "https://collider.com/wp-content/uploads/the-avengers-movie-poster-banners-04.jpg",
    "https://img-cdn.publive.online/fit-in/1200x675/filters:format(webp)/entrackr/media/post_attachments/wp-content/uploads/2023/12/Bookmyshow.jpg",
  "https://dynamic.brandcrowd.com/template/preview/design/0a09f46f-b5d9-4f5f-8eaf-4db0426646ac?v=4&designTemplateVersion=1&size=design-preview-standalone-1x",
];

const BannerCarousel = () => (
  <div className="relative w-full py-6 px-2 overflow-hidden">
    {/* Glassy overlay for branding or effect */}
    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-white/10 via-white/0 to-white/10 rounded-2xl" />
    {/* Rolling carousel effect */}
    <div className="w-full overflow-hidden">
      <div className="flex gap-8 animate-banner-scroll will-change-transform">
        {[...banners, ...banners].map((url, idx) => (
          <div key={idx} className="rounded-2xl shadow-2xl overflow-hidden min-w-[340px] md:min-w-[670px] h-[230px] md:h-[290px] bg-white/30 backdrop-blur-md border border-white/20 relative">
            <img
              src={url}
              alt={`Banner ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* Optional: Add a glassy overlay for text/branding here if desired */}
          </div>
        ))}
      </div>
    </div>
    {/* Custom CSS for animation */}
    <style>{`
      @keyframes banner-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-banner-scroll {
        animation: banner-scroll 32s linear infinite;
      }
    `}</style>
  </div>
);

export default BannerCarousel;