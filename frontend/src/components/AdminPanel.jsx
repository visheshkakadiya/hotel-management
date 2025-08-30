import React, { useState, useEffect } from 'react';
import { Users, Bed, Eye, Edit2, Plus, Trash2 } from 'lucide-react';
import axiosInstance from '../helper/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');
  const [roomsData, setRoomsData] = useState({ total: 0, available: 0, occupied: 0, maintenance: 0 });
  const [roomsList, setRoomsList] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const updateRoomsStatus = async () => {
      try {
        setLoading(true);
        await axiosInstance.patch('/bookings/update-rooms-status');
      } catch (err) {
        toast.error('Failed to update rooms status');
      } finally {
        setLoading(false);
      }
    };
    updateRoomsStatus();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/rooms/all-rooms');
        const rooms = res.data.data;
        setRoomsList(rooms);

        // Calculate stats
        const stats = { total: rooms.length, available: 0, occupied: 0, maintenance: 0 };
        rooms.forEach(room => {
          if (room.status === 'available') stats.available += 1;
          if (room.status === 'occupied') stats.occupied += 1;
          if (room.status === 'maintenance') stats.maintenance += 1;
        });
        setRoomsData(stats);

        // For occupancy, map guest info if present
        const occ = rooms.map(room => ({
          room: room.roomNo,
          type: room.roomType,
          status: room.status,
          guest: room.occupiedBy ? room.occupiedBy.fullName : '-'
        }));
        setOccupancyData(occ);

      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/auth/all-users');
        setCustomersData(res.data.data);
      } catch (err) {
        // handle error
      }
    };

    fetchRooms();
    fetchCustomers();
  }, []);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/rooms/delete-room/${roomId}`);
      toast.success("Room deleted successfully");
      // Refresh rooms list
      const res = await axiosInstance.get('/rooms/all-rooms');
      const rooms = res.data.data;
      setRoomsList(rooms);

      // Update stats
      const stats = { total: rooms.length, available: 0, occupied: 0, maintenance: 0 };
      rooms.forEach(room => {
        if (room.status === 'available') stats.available += 1;
        if (room.status === 'occupied') stats.occupied += 1;
        if (room.status === 'maintenance') stats.maintenance += 1;
      });
      setRoomsData(stats);
    } catch (err) {
      toast.error("Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-orange-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const ManageRooms = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <Bed className="text-gray-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold">{roomsData.total}</p>
              <p className="text-xs text-gray-500">All rooms in the hotel</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <Bed className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Available Rooms</p>
              <p className="text-2xl font-bold">{roomsData.available}</p>
              <p className="text-xs text-gray-500">Ready for booking</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <Bed className="text-orange-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Occupied Rooms</p>
              <p className="text-2xl font-bold">{roomsData.occupied}</p>
              <p className="text-xs text-gray-500">Currently booked</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <Bed className="text-red-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Under Maintenance</p>
              <p className="text-2xl font-bold">{roomsData.maintenance}</p>
              <p className="text-xs text-gray-500">Currently unavailable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Listings */}
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Room Listings</h2>
          <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            onClick={() => navigate('/add-room')}
          >
            <Plus size={16} />
            Add New Room
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Room No.</th>
                <th className="text-left p-4 font-medium text-gray-600">Type</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Price</th>
                <th className="text-left p-4 font-medium text-gray-600">Capacity</th>
                <th className="text-left p-4 font-medium text-gray-600">Last Modified</th>
                <th className="text-left p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomsList.map((room, index) => (
                <tr key={room._id || index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{room.roomNo}</td>
                  <td className="p-4">{room.roomType}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">${room.price?.toFixed(2)}</td>
                  <td className="p-4">{room.capacity}</td>
                  <td className="p-4 text-gray-600">{new Date(room.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button className="text-gray-600 hover:text-orange-500 transition-colors"
                      onClick={() => navigate(`/edit-room/${room._id}`)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="text-gray-600 hover:text-red-500 transition-colors"
                      onClick={() => handleDeleteRoom(room._id)}
                      title="Delete Room"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CustomerManagement = () => (
    <div className="space-y-6">
      {/* Total Customers Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <Users className="text-blue-500" size={32} />
          <div>
            <p className="text-sm text-gray-600">Total Customers</p>
            <p className="text-3xl font-bold">{customersData.length}</p>
            <p className="text-xs text-gray-500">As of today</p>
          </div>
        </div>
      </div>

      {/* Customer Profiles */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Customer Profiles</h2>
          <p className="text-gray-600">Manage and view details of your hotel guests.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Phone</th>
                <th className="text-left p-4 font-medium text-gray-600">Address</th>
                <th className="text-left p-4 font-medium text-gray-600">Reg. Date</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer, index) => (
                <tr key={customer._id || index} className="border-b hover:bg-gray-50">
                  <td className="p-4">{customer.fullName}</td>
                  <td className="p-4 text-gray-600">{customer.email}</td>
                  <td className="p-4 text-gray-600">{customer.contactNumber}</td>
                  <td className="p-4 text-gray-600">{customer.address}</td>
                  <td className="p-4 text-gray-600">{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RoomOccupancy = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Room Occupancy Overview</h2>
        <p className="text-gray-600">Current status of all rooms.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Room</th>
              <th className="text-left p-4 font-medium text-gray-600">Type</th>
              <th className="text-left p-4 font-medium text-gray-600">Status</th>
              <th className="text-left p-4 font-medium text-gray-600">Guest</th>
            </tr>
          </thead>
          <tbody>
            {occupancyData.map((room, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{room.room}</td>
                <td className="p-4">{room.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  {room.guest !== '-' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {room.guest}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Admin Dashboard</h1>
          <p className="text-gray-600">Manage your hotel operations efficiently</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton id="rooms" label="Manage Rooms" icon={Bed} />
          <TabButton id="customers" label="Customer Management" icon={Users} />
          <TabButton id="occupancy" label="Room Occupancy" icon={Eye} />
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'rooms' && <ManageRooms />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'occupancy' && <RoomOccupancy />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;