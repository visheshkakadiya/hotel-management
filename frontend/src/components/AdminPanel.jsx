import React, { useState } from 'react';
import { Users, Bed, Eye, Edit2, Plus } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rooms');

  // Dummy data for rooms
  const roomsData = {
    total: 12,
    available: 8,
    occupied: 2,
    maintenance: 2
  };

  const roomsList = [
    { roomNo: '101', type: 'Standard', status: 'Available', price: '$150.00', capacity: 2, lastModified: '2024-08-28' },
    { roomNo: '102', type: 'Deluxe', status: 'Occupied', price: '$250.00', capacity: 3, lastModified: '2024-08-27' },
    { roomNo: '103', type: 'Suite', status: 'Available', price: '$400.00', capacity: 4, lastModified: '2024-08-28' }
  ];

  // Dummy data for customers
  const customersData = [
    { id: 'CUST001', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-123-4567', status: 'Active', regDate: '2023-01-15' },
    { id: 'CUST002', name: 'Bob Williams', email: 'bob@example.com', phone: '555-234-5678', status: 'VIP', regDate: '2022-03-20' },
    { id: 'CUST003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-345-6789', status: 'New', regDate: '2024-02-01' }
  ];

  // Dummy data for room occupancy
  const occupancyData = [
    { room: '101', type: 'Standard Single', status: 'Occupied', guest: 'Sarah Connor' },
    { room: '102', type: 'Standard Double', status: 'Available', guest: '-' },
    { room: '103', type: 'Deluxe Twin', status: 'Maintenance', guest: '-' },
    { room: '201', type: 'Executive Suite', status: 'Occupied', guest: 'Michael Scott' },
    { room: '202', type: 'Standard Single', status: 'Available', guest: '-' }
  ];

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
          <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
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
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{room.roomNo}</td>
                  <td className="p-4">{room.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="p-4">{room.price}</td>
                  <td className="p-4">{room.capacity}</td>
                  <td className="p-4 text-gray-600">{room.lastModified}</td>
                  <td className="p-4">
                    <button className="text-gray-600 hover:text-orange-500 transition-colors">
                      <Edit2 size={16} />
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
                <th className="text-left p-4 font-medium text-gray-600">Customer ID</th>
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Email</th>
                <th className="text-left p-4 font-medium text-gray-600">Phone</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Reg. Date</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{customer.id}</td>
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4 text-gray-600">{customer.email}</td>
                  <td className="p-4 text-gray-600">{customer.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{customer.regDate}</td>
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
                    {room.status}
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