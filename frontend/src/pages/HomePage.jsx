import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWifi, FaSwimmer, FaUtensils, FaSpa, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/rooms/all-rooms");
        setRooms(response.data.data || []);
      } catch (error) {
        toast.error("Error fetching rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleBookNow = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[90vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white max-w-3xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            Experience Comfort & Luxury
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-5 text-lg md:text-xl text-gray-200"
          >
            Your perfect stay awaits you at{" "}
            <span className="font-semibold text-orange-400">HotelEase</span>
          </motion.p>
          <motion.button
            onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            className="mt-8 bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-orange-700 transition"
          >
            Book Your Stay
          </motion.button>
        </div>
      </div>

      {/* Featured Rooms */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h3 className="text-4xl font-bold text-center mb-14 text-gray-800">
          Featured Rooms
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500">No rooms available</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition"
              >
                <img
                  src={room.roomImage?.url}
                  alt={room.roomType}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold capitalize text-gray-800">
                    {room.roomType} Room
                  </h4>
                  <p className="text-gray-600 text-lg mb-4">
                    ${room.price}{" "}
                    <span className="text-sm text-gray-400">/ night</span>
                  </p>
                  <button
                    onClick={() => handleBookNow(room._id)}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Amenities */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-14">Amenities</h3>
          <div className="grid md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <FaWifi className="text-5xl text-orange-600 mb-4" />
              <h4 className="text-xl font-semibold">Free Wi-Fi</h4>
              <p className="text-gray-600 mt-2">Stay connected with high-speed internet.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaUtensils className="text-5xl text-orange-600 mb-4" />
              <h4 className="text-xl font-semibold">Restaurant</h4>
              <p className="text-gray-600 mt-2">Enjoy world-class cuisines & beverages.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaSwimmer className="text-5xl text-orange-600 mb-4" />
              <h4 className="text-xl font-semibold">Swimming Pool</h4>
              <p className="text-gray-600 mt-2">Relax & refresh at our luxury pool.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaSpa className="text-5xl text-orange-600 mb-4" />
              <h4 className="text-xl font-semibold">Spa & Wellness</h4>
              <p className="text-gray-600 mt-2">Pamper yourself with relaxing therapies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-14">What Our Guests Say</h3>
          <div className="grid md:grid-cols-3 gap-10">
            {["Amazing stay!", "Luxurious rooms!", "Exceptional service!"].map(
              (review, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                >
                  <p className="text-gray-600 italic mb-4">
                    “{review} Highly recommend HotelEase!”
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Guest"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Guest {i + 1}</h4>
                      <p className="text-sm text-gray-500">Traveler</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="relative bg-cover bg-center h-[60vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501117716987-c8e2a1a4f87d?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center text-white max-w-2xl">
          <h3 className="text-4xl font-bold mb-4">Ready for Your Dream Stay?</h3>
          <p className="mb-6 text-gray-300">
            Book now and experience unmatched comfort and luxury at HotelEase.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-white text-xl font-semibold mb-4">HotelEase</h4>
            <p>
              Luxury & comfort redefined. Your ultimate destination for a premium
              stay experience.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Rooms</li>
              <li>Amenities</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact</h4>
            <p className="flex items-center gap-2"><FaPhoneAlt /> +1 234 567 890</p>
            <p className="flex items-center gap-2"><FaEnvelope /> info@hotelease.com</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> New York, USA</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Newsletter</h4>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-lg text-white/50 border-2 mb-3"
            />
            <button className="w-full bg-orange-600 py-2 rounded-lg hover:bg-orange-700 transition">
              Subscribe
            </button>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-10 text-sm">
          © {new Date().getFullYear()} HotelEase. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
