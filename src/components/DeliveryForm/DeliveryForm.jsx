import React, { useState } from 'react';
import { TimeSlotPicker } from '../TimeSlotPicker/TimeSlotPicker';
import { useDeliveryStore } from '../stores/useDeliveryStore';

export const DeliveryForm = () => {
  const [address, setAddress] = useState('');
  const { timeSlots, bookDelivery } = useDeliveryStore();

  const handleSubmit = (timeSlotId) => {
    if (address.trim()) {
      bookDelivery(address, timeSlotId);
      setAddress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Schedule a Delivery</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter delivery address"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Select a Time Slot</h3>
        <TimeSlotPicker
          timeSlots={timeSlots}
          onSelect={(timeSlotId) => handleSubmit(timeSlotId)}
        />
      </div>
    </div>
  );
};


