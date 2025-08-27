import React from "react";

const rooms = [
  {
    id: 1,
    name: "Executive Suite",
    price: 120,
    img: "https://source.unsplash.com/400x300/?hotel,room"
  },
  {
    id: 2,
    name: "Deluxe King Room",
    price: 150,
    img: "https://source.unsplash.com/400x300/?luxury,bedroom"
  },
  {
    id: 3,
    name: "Standard Double Room",
    price: 90,
    img: "https://source.unsplash.com/400x300/?bed,interior"
  },
  {
    id: 4,
    name: "Ocean View Suite",
    price: 200,
    img: "https://source.unsplash.com/400x300/?ocean,hotel"
  },
];

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[80vh] flex items-center justify-center"
        style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?hotel,lobby')" }}>
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
        <h3 className="text-3xl font-bold text-center mb-10">Featured Rooms</h3>
        <div className="grid md:grid-cols-4 gap-8">
          {rooms.map(room => (
            <div key={room.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition">
              <img src={room.img} alt={room.name} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h4 className="text-xl font-semibold">{room.name}</h4>
                <p className="text-gray-500 mb-4">${room.price}/night</p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
