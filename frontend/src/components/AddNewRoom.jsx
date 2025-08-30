import React, { useState } from 'react';
import { ArrowLeft, Upload, Eye, Save, X } from 'lucide-react';
import axiosInstance from '../helper/axiosInstance.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddNewRoom = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNo: '',
    roomType: '',
    status: 'Available',
    price: '',
    capacity: '',
    roomImage: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const roomTypes = [
    'standard',
    'deluxe',
    'luxury'
  ];

  const statusOptions = [
    'Available',
    'Maintenance'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          roomImage: 'Please select a valid image file'
        }));
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          roomImage: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        roomImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (errors.roomImage) {
        setErrors(prev => ({
          ...prev,
          roomImage: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      roomImage: null
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('roomImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNo.trim()) {
      newErrors.roomNo = 'Room number is required';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Room type is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Please enter a valid capacity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const form = new FormData();
        form.append("roomNo", formData.roomNo);
        form.append("roomType", formData.roomType);
        form.append("status", formData.status.toLowerCase());
        form.append("price", formData.price);
        form.append("capacity", formData.capacity);
        if (formData.roomImage) {
          form.append("roomImage", formData.roomImage);
        }

        const res = await axiosInstance.post("/rooms/create-room", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        toast.success("Room added successfully!");
        // Optionally, navigate to dashboard or reset form
        setFormData({
          roomNo: '',
          roomType: '',
          status: 'Available',
          price: '',
          capacity: '',
          roomImage: null
        });
        setImagePreview(null);
        setErrors({});
        navigate('/admin-panel');
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add room");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/admin-panel');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
            <p className="text-gray-600 mt-1">Fill in the details to add a new room to your hotel inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Room Number */}
                <div>
                  <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    id="roomNo"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 101, 201, 301"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.roomNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.roomNo && <p className="text-red-500 text-xs mt-1">{errors.roomNo}</p>}
                </div>

                {/* Room Type */}
                <div>
                  <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.roomType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.roomType && <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {statusOptions.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Night (USD) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="150.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Capacity */}
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="2"
                    min="1"
                    max="10"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                </div>
              </div>

              {/* Right Column - Image Upload and Preview */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Image
                  </label>
                  
                  {/* Upload Area */}
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 mb-2">Drop an image here or click to browse</p>
                      <p className="text-xs text-gray-500 mb-4">Supports: JPG, PNG, WebP (Max 5MB)</p>
                      <input
                        type="file"
                        id="roomImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="roomImage"
                        className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                      >
                        <Upload size={16} />
                        Choose Image
                      </label>
                    </div>
                  ) : (
                    /* Image Preview */
                    <div className="space-y-4">
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Room preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye size={16} />
                        <span>Live Preview</span>
                      </div>
                      
                      <input
                        type="file"
                        id="roomImageReplace"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="roomImageReplace"
                        className="inline-flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        <Upload size={16} />
                        Replace Image
                      </label>
                    </div>
                  )}
                  
                  {errors.roomImage && <p className="text-red-500 text-xs mt-1">{errors.roomImage}</p>}
                </div>

                {/* Form Summary Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Room Preview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Number:</span>
                      <span className="font-medium">{formData.roomNo || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{formData.roomType || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {formData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{formData.price ? `$${formData.price}` : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{formData.capacity ? `${formData.capacity} guests` : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewRoom;