import React, { useEffect, useState } from 'react';
import { Calendar, Users, Trash2, ChevronDown } from 'lucide-react';
import axiosInstance from '../helper/axiosInstance.js';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [activeBookings, setActiveBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  useEffect(() => {
    // Mark past bookings as completed
    const markPastBookings = async () => {
      try {
        await axiosInstance.patch('/bookings/complete-past-bookings');
      } catch (error) {
        // Silently ignore errors
      }
    };
    markPastBookings();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/bookings/booking-history");
        const bookings = res.data.data;

        // Separate active and history bookings
        setActiveBookings(
          bookings.filter(b => b.status.toLowerCase() === 'confirmed')
        );
        setBookingHistory(
          bookings.filter(b => ['completed', 'cancelled'].includes(b.status.toLowerCase()))
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (roomId, bookingId) => {
    try {
      await axiosInstance.patch(`/bookings/cancel-booking/${roomId}/${bookingId}`);
      toast.success('Booking cancelled successfully');
      // Refresh bookings
      const res = await axiosInstance.get("/bookings/booking-history");
      const bookings = res.data.data;
      setActiveBookings(bookings.filter(b => b.status.toLowerCase() === 'confirmed'));
      setBookingHistory(bookings.filter(b => ['completed', 'cancelled'].includes(b.status.toLowerCase())));
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings Dashboard</h1>
          <p className="text-gray-600">Manage your current and past hotel reservations</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Bookings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Booking History
            </button>
          </nav>
        </div>

        {/* Current Bookings Tab */}
        {activeTab === 'current' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Current Bookings</h2>
              <span className="text-gray-500 text-sm">
                {activeBookings.length} active booking{activeBookings.length !== 1 ? 's' : ''}
              </span>
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : activeBookings.length === 0 ? (
              <div className="text-gray-500">No active bookings found.</div>
            ) : (
              activeBookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <div className="flex flex-col lg:flex-row">
                    {/* Room Image */}
                    <div className="lg:w-1/4">
                      <img
                        src={booking.room[0]?.roomImage?.url}
                        alt={booking.room[0]?.roomType}
                        className="w-full h-48 lg:h-full object-cover"
                      />
                    </div>
                    {/* Booking Details */}
                    <div className="lg:w-3/4 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.room[0]?.roomType}</h3>
                          <p className="text-gray-600">Booking for upcoming stay</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Check-in</p>
                            <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Check-out</p>
                            <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="font-medium">{booking.guests}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="font-bold text-lg text-green-600">${booking.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          onClick={() => handleCancelBooking(booking.room[0]?._id, booking._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Booking History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Booking History</h2>
              <p className="text-gray-500 text-sm">Track your past and cancelled reservations</p>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500">Loading...</td>
                      </tr>
                    ) : bookingHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500">No booking history found.</td>
                      </tr>
                    ) : (
                      bookingHistory.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.room[0]?.roomType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.checkInDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.checkOutDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.guests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(booking.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${booking.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center">
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                View All Past Bookings
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;