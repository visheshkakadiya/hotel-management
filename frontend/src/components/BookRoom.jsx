import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, User, Phone, Mail, MapPin, AlertCircle, Clock, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from "../helper/axiosInstance.js";

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState({
    numberOfNights: 0,
    roomRate: 0,
    tax: 0,
    totalPrice: 0
  });

  const [isDateConflict, setIsDateConflict] = useState(false);
  const [conflictMessage, setConflictMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [occupiedDates, setOccupiedDates] = useState([]);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      specialRequests: ''
    }
  });

  const watchedCheckIn = watch('checkInDate');
  const watchedCheckOut = watch('checkOutDate');
  const watchedGuests = watch('numberOfGuests');

  useEffect(() => {
    const getRoomAndOccupiedDates = async () => {
      try {
        setLoading(true);
        const roomRes = await axiosInstance.get(`/rooms/room/${roomId}`);
        const occupiedDatesRes = await axiosInstance.get(`/bookings/occupied-dates/${roomId}`);

        setRoomData(roomRes.data.data);
        setOccupiedDates(occupiedDatesRes.data.data);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch room data");
      } finally {
        setLoading(false);
      }
    }

    getRoomAndOccupiedDates();
  }, [roomId]);

  // Function to check date conflicts
  const checkDateConflict = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return false;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    for (const occupied of occupiedDates) {
      const occupiedStart = new Date(occupied.checkInDate);
      const occupiedEnd = new Date(occupied.checkOutDate);

      // Check if dates overlap
      if (
        (checkInDate >= occupiedStart && checkInDate < occupiedEnd) ||
        (checkOutDate > occupiedStart && checkOutDate <= occupiedEnd) ||
        (checkInDate <= occupiedStart && checkOutDate >= occupiedEnd)
      ) {
        return true;
      }
    }
    return false;
  };

  // Calculate booking details
  useEffect(() => {
    if (roomData && watchedCheckIn && watchedCheckOut) {
      const checkIn = new Date(watchedCheckIn);
      const checkOut = new Date(watchedCheckOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if dates are in the past
      if (checkIn < today || checkOut < today) {
        setConflictMessage('Cannot book dates in the past');
        setIsDateConflict(true);
        return;
      }

      // Check if checkout is before checkin
      if (checkOut <= checkIn) {
        setConflictMessage('Check-out date must be after check-in date');
        setIsDateConflict(true);
        return;
      }

      // Check date conflicts
      if (checkDateConflict(watchedCheckIn, watchedCheckOut)) {
        setConflictMessage('Selected dates conflict with existing bookings');
        setIsDateConflict(true);
        return;
      }

      // Calculate nights and pricing
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const roomRate = roomData.room.price * numberOfNights;
      const tax = roomRate * 0.15;
      const totalPrice = roomRate + tax;

      setBookingDetails({
        numberOfNights,
        roomRate,
        tax,
        totalPrice
      });

      setIsDateConflict(false);
      setConflictMessage('');
    } else {
      setBookingDetails({
        numberOfNights: 0,
        roomRate: 0,
        tax: 0,
        totalPrice: 0
      });
      setIsDateConflict(false);
      setConflictMessage('');
    }
  }, [watchedCheckIn, watchedCheckOut, roomData, occupiedDates]);

  const onSubmit = async (data) => {
    if (isDateConflict) {
      return;
    }
    try {
      await axiosInstance.post(`/bookings/book-room/${roomId}`, {
        guests: data.numberOfGuests,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        specialRequest: data.specialRequests,
        totalPrice: bookingDetails.totalPrice
      });
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading || !roomData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Book Your Stay</h1>
            <p className="text-blue-100">Fill in the details below to secure your room.</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Booking Form */}
            <div className="lg:w-2/3 p-6">
              <div className="space-y-6">
                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Check-in Date
                    </label>
                    <Controller
                      name="checkInDate"
                      control={control}
                      rules={{ required: 'Check-in date is required' }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          min={getTodayDate()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.checkInDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkInDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Check-out Date
                    </label>
                    <Controller
                      name="checkOutDate"
                      control={control}
                      rules={{ required: 'Check-out date is required' }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          min={watch('checkInDate') || getTodayDate()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.checkOutDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkOutDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Date Conflict Warning */}
                {conflictMessage && (
                  <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-red-700 font-medium">{conflictMessage}</span>
                  </div>
                )}

                {/* Room Type and Guests */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                    <input
                      type="text"
                      value={`${roomData.room.roomType.charAt(0).toUpperCase() + roomData.room.roomType.slice(1)} King Room`}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline w-4 h-4 mr-2" />
                      Number of Guests
                    </label>
                    <Controller
                      name="numberOfGuests"
                      control={control}
                      rules={{
                        required: 'Number of guests is required',
                        min: { value: 1, message: 'At least 1 guest required' },
                        max: { value: roomData.room.capacity, message: `Maximum ${roomData.room.capacity} guests allowed` }
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="1"
                          max={roomData.room.capacity}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.numberOfGuests && (
                      <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests.message}</p>
                    )}
                  </div>
                </div>

                {/* Guest Information (Disabled) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Guest Information</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={roomData.user.fullName}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={roomData.user.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={roomData.user.contactNumber}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-2" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={roomData.user.address}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <Controller
                    name="specialRequests"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows="4"
                        placeholder="e.g., non-smoking room, extra pillows, early check-in"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isDateConflict || !watchedCheckIn || !watchedCheckOut}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                >
                  {isDateConflict ? 'Cannot Book - Date Conflict' : 'Confirm Booking'}
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:w-1/3 bg-gray-50 p-6">
              <div className="sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h2>

                {/* Room Image */}
                <div className="mb-6">
                  <img
                    src={roomData.room.roomImage.url}
                    alt="Room"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{formatDate(watchedCheckIn)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{formatDate(watchedCheckOut)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium">
                      {roomData.room.roomType.charAt(0).toUpperCase() + roomData.room.roomType.slice(1)} King Room
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">{watchedGuests} Adult(s)</span>
                  </div>

                  {bookingDetails.numberOfNights > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nights:</span>
                        <span className="font-medium">{bookingDetails.numberOfNights}</span>
                      </div>

                      <hr className="border-gray-300" />

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Room Rate:</span>
                        <span className="font-medium">${bookingDetails.roomRate.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taxes & Fees (15%):</span>
                        <span className="font-medium">${bookingDetails.tax.toFixed(2)}</span>
                      </div>

                      <hr className="border-gray-300" />

                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-orange-600">Total Price:</span>
                        <span className="text-orange-600">${bookingDetails.totalPrice.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {bookingDetails.numberOfNights === 0 && (
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-orange-600">Total Price:</span>
                      <span className="text-orange-600">$0.00</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Booking Policy</p>
                      <p>Prices are indicative and subject to change based on final selection and availability. Payment details will be collected on the next step.</p>
                    </div>
                  </div>
                </div>

                {/* Occupied Dates Display */}
                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Unavailable Dates:</h4>
                  <div className="space-y-1 text-sm text-red-700">
                    {occupiedDates.map((date, index) => (
                      <div key={index}>
                        {new Date(date.checkInDate).toLocaleDateString()} - {new Date(date.checkOutDate).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;