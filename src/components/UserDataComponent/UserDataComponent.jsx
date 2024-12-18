import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, setHours, setMinutes } from 'date-fns';

const UserDataComponent = () => {
  const [userData, setUserData] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  // Define city-specific time slots
  const cityTimeSlots = {
    Chennai: [
      { id: 1, startTime: setHours(setMinutes(new Date(), 0), 10), endTime: setHours(setMinutes(new Date(), 0), 11), capacity: 10, bookedCount: 2 },
      { id: 2, startTime: setHours(setMinutes(new Date(), 0), 14), endTime: setHours(setMinutes(new Date(), 0), 15), capacity: 10, bookedCount: 8 },
    ],
    Madurai: [
      { id: 3, startTime: setHours(setMinutes(new Date(), 0), 9), endTime: setHours(setMinutes(new Date(), 0), 10), capacity: 10, bookedCount: 5 },
      { id: 4, startTime: setHours(setMinutes(new Date(), 0), 13), endTime: setHours(setMinutes(new Date(), 0), 14), capacity: 10, bookedCount: 4 },
    ],
  };

  // Address selection handler
  const addressHandler = (event) => {
    setAddress(event.target.value);
    setSelectedDate(null); // Reset date when address changes
    setSelectedSlot(null);
    setTimeSlots([]);
  };

  // Date selection handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Adjust timeslot start/end times based on selected date
    const updatedSlots = cityTimeSlots[address]?.map((slot) => ({
      ...slot,
      startTime: setHours(setMinutes(new Date(date), slot.startTime.getMinutes()), slot.startTime.getHours()),
      endTime: setHours(setMinutes(new Date(date), slot.endTime.getMinutes()), slot.endTime.getHours()),
    }));
    setTimeSlots(updatedSlots || []);
    setSelectedSlot(null);
  };

  // Slot selection handler with confirmation dialog
  const onSelectSlot = (slot) => {
    const confirm = window.confirm(
      `Do you want to confirm the delivery on ${format(slot.startTime, 'dd/MM/yyyy')} between ${format(slot.startTime, 'h:mm a')} and ${format(slot.endTime, 'h:mm a')}?`
    );
    if (confirm) {
      setSelectedSlot(slot);
      setDeliveries((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          address: address,
          timeSlot: slot,
          status: 'Scheduled',
        },
      ]);
    }
  };

  useEffect(() => {
    // Fetch user data
    axios
      .post(`http://localhost:3500/api/v1/userdata`, {
        token: window.localStorage.getItem('token'),
      })
      .then((response) => {
        console.log(response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        alert(`Status : ${error.response.status} - ${error.response.data.message}`);
      });
  }, []);

  return (
    <React.Fragment>
      {/* User Details Section */}
      <div className="divbarContainer">
        <h1 className="pageTitle">User Details</h1>
        <div className="userDetails">
          <div className="userInfo">
            <p className="userInfoLabel">First Name:</p>
            <h4 className="userInfoValue">{userData.firstName}</h4>
          </div>
          <div className="userInfo">
            <p className="userInfoLabel">Last Name:</p>
            <h4 className="userInfoValue">{userData.lastName}</h4>
          </div>
          <div className="userInfo">
            <p className="userInfoLabel">Email:</p>
            <h4 className="userInfoValue">{userData.email}</h4>
          </div>
          <div className="userInfo">
            <p className="userInfoLabel">Role:</p>
            <h4 className="userInfoValue">{userData.role}</h4>
          </div>
        </div>
      </div>

      {/* Address Selection */}
      <div>
        <h4>Address</h4>
        <select
          className="form-control"
          value={address}
          onChange={addressHandler}
          required
        >
          <option>Select Address</option>
          <option>Chennai</option>
          <option>Madurai</option>
        </select>
      </div>

      {/* Date Picker */}
      {address && (
        <div className="mt-4">
          <h4>Select Date</h4>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={addDays(new Date(), 1)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            className="form-control"
          />
        </div>
      )}

      {/* Available Timeslots */}
      {selectedDate && (
        <div className="mt-4">
          <h4>Available TimeSlots</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onSelectSlot(slot)}
                disabled={slot.bookedCount >= slot.capacity}
                className={`p-4 rounded-lg border ${
                  slot.bookedCount >= slot.capacity
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-white hover:bg-blue-50 border-blue-200'
                }`}
              >
                <div className="font-semibold">
                  {format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}
                </div>
                <div className="text-sm text-gray-500">
                  {slot.capacity - slot.bookedCount} slots available
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Deliveries */}
      {deliveries.length > 0 && (
        <div className="max-w-2xl mx-auto p-6 mt-6">
          <h2 className="text-2xl font-bold mb-6">Scheduled Deliveries</h2>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{delivery.address}</p>
                    <p className="text-sm text-gray-500">
                      {format(delivery.timeSlot.startTime, 'dd/MM/yyyy')}
                      <br />
                      {format(delivery.timeSlot.startTime, 'h:mm a')} -
                      {format(delivery.timeSlot.endTime, 'h:mm a')}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {delivery.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserDataComponent;
