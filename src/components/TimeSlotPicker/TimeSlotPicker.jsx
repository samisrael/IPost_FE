import React from 'react';
import { format } from 'date-fns';

export const TimeSlotPicker = ({ timeSlots, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {timeSlots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot.id)}
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
  );
};
