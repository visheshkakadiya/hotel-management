import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  }

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?hotel,lobby')",
        }}
      >
        <div className="bg-black/50 p-8 rounded-xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Experience Comfort & Luxury at HotelEase
          </h2>
          <p className="text-gray-200 mt-3">Your perfect stay awaits you</p>
          <button className="mt-5 bg-orange-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-700 transition">
            Book Your Stay
          </button>
        </div>
      </div>

      {/* Featured Rooms */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">
          Featured Rooms
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500">No rooms available</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={room.roomImage?.url}
                  alt={room.roomType}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h4 className="text-xl font-semibold capitalize">
                    {room.roomType} Room
                  </h4>
                  <p className="text-gray-700 mb-4 font-medium">
                    ${room.price}/night
                  </p>

                  {/* Always show Book Now */}
                  <button 
                  onClick={() => handleBookNow(room._id)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
