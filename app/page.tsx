"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { addDoc } from "firebase/firestore";


export default function Home() {
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [filter, setFilter] = useState("All");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  // 🎬 Fetch Hero Video
  useEffect(() => {
    const fetchVideo = async () => {
      const docRef = doc(db, "settings", "hero");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setVideoUrl(docSnap.data().videoUrl);
      }
    };

    fetchVideo();
  }, []);



  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "bookings"), {
        name,
        email,
        phone,
        eventType,
        date,
        message,
        createdAt: Date.now()
      });

      alert("Booking submitted successfully 🎉");

      // 📲 WhatsApp Message
      const text = `Hello Infinity Events 👋

New Booking Request:
Name: ${name}
Phone: ${phone}
Email: ${email}
Event: ${eventType}
Date: ${date}

Message:
${message}`;

      const whatsappUrl = `https://wa.me/919731960606?text=${encodeURIComponent(text)}`;

      // 🔥 Open WhatsApp
      window.open(whatsappUrl, "_blank");

      alert("Booking submitted! Redirecting to WhatsApp 📲");


      // reset
      setName("");
      setEmail("");
      setPhone("");
      setEventType("Wedding");
      setDate("");
      setMessage("");

    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  // 📸 Fetch Gallery
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(data);
    };

    fetchData();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredImages =
    filter === "All"
      ? images
      : images.filter((img) => img.category === filter);

  return (
    <>
      {/* 🎬 HERO SECTION */}
      <div className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">

        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover scale-105"
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
        </video>

        {/* Overlay */}
        <div className="absolute w-full h-full bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#D4AF37] tracking-wide">
            Infinity Events
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Capturing Moments. Creating Memories.
          </p>

          <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Explore Gallery
          </button>
        </div>
      </div>

      {/* 📸 GALLERY SECTION */}
      <div className="bg-gradient-to-b from-black to-[#0F1F1C] min-h-screen text-white p-10">

        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-[#D4AF37]">
          Our Gallery
        </h1>

        {/* 🔥 FILTER BUTTONS */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {["All", "Wedding", "Birthday", "Pre-Wedding", "Engagement"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full border transition ${filter === cat
                ? "bg-[#D4AF37] text-black"
                : "border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🖼️ GALLERY GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              {/* IMAGE */}
              <img
                src={img.imageUrl}
                className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-500"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <p className="text-lg text-white font-semibold">
                  {img.category}
                </p>
              </div>

              
            </div>
          ))}
        </div>

      </div>

      {/* 💎 ABOUT US */}
      <div className="bg-gradient-to-b from-black to-[#0F1F1C] text-white py-20 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-6">
              About Infinity Events
            </h2>

            <p className="text-gray-300 mb-4 leading-relaxed">
              At Infinity Events, we specialize in capturing life’s most precious moments
              through stunning photography and cinematic videography. From grand weddings
              to intimate celebrations, we turn your memories into timeless stories.
            </p>

            <p className="text-gray-400 mb-6">
              With a passion for creativity and attention to detail, we ensure every frame
              reflects elegance, emotion, and perfection.
            </p>

            {/* SERVICES */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                📸 Wedding Photography
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                🎬 Cinematic Videography
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                🎉 Event Coverage
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                💎 Premium Editing
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            {/* RIGHT CONTACT */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl">

              <h3 className="text-2xl font-semibold text-[#D4AF37] mb-6">
                Contact Us
              </h3>

              <div className="space-y-4 text-gray-300">

                <p>
                  📍 <span className="text-white">JSS College Main Rd, Siddhartha Nagar, Chamarajanagar, Karnataka 571313</span>
                </p>

                <p>
                  📞 <span className="text-white">+91 9731960606</span>
                </p>

                <p>
                  📧 <span className="text-white">infinityeventska10@gmail.com</span>
                </p>

              </div>

              {/* CTA BUTTON */}

              <a
                href="https://wa.me/919731960606"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-8 text-center bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
              >
                Chat on WhatsApp
              </a>

            </div>

            {/* Overlay glow */}
            <div className="absolute inset-0 rounded-2xl bg-black/20 pointer-events-none"></div>
          </div>

        </div>
      </div>

      {/* 💬 BOOKING SECTION */}
      <div className="bg-black text-white py-20 px-6">

        <h2 className="text-4xl text-center text-[#D4AF37] mb-10 font-bold">
          Book Your Event
        </h2>

        <form
          onSubmit={handleBooking}
          className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10"
        >

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white text-black"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white text-black"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white text-black"
          />

          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white text-black"
          >
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Corporate</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white text-black"
          />

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-white text-black"
          />

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Submit Booking
          </button>
        </form>
      </div>

      {/* 💎 FOOTER */}
      <div className="bg-black text-center text-gray-400 py-6">
        © 2026 Infinity Events | Crafted with ❤️
      </div>
      {/* 📲 FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919731960606"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300">

          {/* WhatsApp Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.52 3.48A11.91 11.91 0 0 0 12 .5C5.65.5.5 5.65.5 12c0 2.11.55 4.17 1.6 6l-1.7 6.2 6.36-1.66A11.94 11.94 0 0 0 12 23.5c6.35 0 11.5-5.15 11.5-11.5 0-3.07-1.2-5.95-3.48-8.52ZM12 21.5c-1.86 0-3.68-.5-5.28-1.44l-.38-.22-3.78.99 1.01-3.69-.25-.38A9.46 9.46 0 0 1 2.5 12c0-5.25 4.25-9.5 9.5-9.5S21.5 6.75 21.5 12 17.25 21.5 12 21.5Zm5.2-7.3c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.36-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.83-2.03-.22-.52-.44-.45-.61-.46-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.86.14.18 1.95 2.97 4.73 4.16.66.28 1.18.45 1.59.58.67.21 1.27.18 1.75.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32Z" />
          </svg>

        </div>
      </a>
    </>
  );
}