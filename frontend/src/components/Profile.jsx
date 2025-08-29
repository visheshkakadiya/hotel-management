import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../helper/axiosInstance.js';
import toast from 'react-hot-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      contactNumber: '',
      address: ''
    }
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        setUserData(res.data.data);
        reset({
          fullName: res.data.data.fullName,
          email: res.data.data.email,
          contactNumber: res.data.data.contactNumber,
          address: res.data.data.address
        });
      } catch (error) {
        toast.error('Failed to fetch user profile');
      }
    };
    fetchUser();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch('/auth/update-profile', data);
      setUserData(res.data.data);
      reset({
        fullName: res.data.data.fullName,
        email: res.data.data.email,
        contactNumber: res.data.data.contactNumber,
        address: res.data.data.address
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      reset({
        fullName: userData.fullName,
        email: userData.email,
        contactNumber: userData.contactNumber,
        address: userData.address
      });
    }
    setIsEditing(false);
  };

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-1/3 bg-gradient-to-b from-blue-600 to-purple-700 p-8 text-white">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <img
                    src={userData.avatar?.url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors" disabled>
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mt-4">{userData.fullName}</h2>
                <p className="text-blue-100 text-sm">{userData.email}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-2/3 p-8">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">Personal Information</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <p className="text-gray-600">Manage your contact details and preferences.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  {/* Full Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <Controller
                          name="fullName"
                          control={control}
                          rules={{ required: 'Full name is required' }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your full name"
                            />
                          )}
                        />
                      ) : (
                        <input
                          type="text"
                          value={userData.fullName}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                        />
                      )}
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address'
                            }
                          }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="email"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter your email"
                            />
                          )}
                        />
                      ) : (
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                        />
                      )}
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Controller
                        name="contactNumber"
                        control={control}
                        rules={{ required: 'Phone number is required' }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your phone number"
                          />
                        )}
                      />
                    ) : (
                      <input
                        type="tel"
                        value={userData.contactNumber}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                      />
                    )}
                    {errors.contactNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Address
                    </label>
                    {isEditing ? (
                      <Controller
                        name="address"
                        control={control}
                        rules={{ required: 'Address is required' }}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full address"
                          />
                        )}
                      />
                    ) : (
                      <textarea
                        value={userData.address}
                        disabled
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 resize-none"
                      />
                    )}
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;