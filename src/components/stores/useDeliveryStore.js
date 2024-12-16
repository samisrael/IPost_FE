import { create } from 'zustand';
import axios from 'axios'; // make sure axios is imported

export const useDeliveryStore = create((set) => ({
  timeSlots: [],
  deliveries: [],
  
  // Function to generate time slots
  generateTimeSlots: () => {
    const slots = [];
    const startTime = 9; // Start at 9 AM
    const endTime = 17; // End at 5 PM
    const slotDuration = 1; // Each slot lasts 1 hour
    const capacity = 5; // Max deliveries per slot

    for (let hour = startTime; hour < endTime; hour++) {
      const start = new Date();
      start.setHours(hour, 0, 0, 0); // Set the start time (e.g., 9:00 AM)
      const end = new Date(start);
      end.setHours(hour + slotDuration, 0, 0, 0); // Set the end time (e.g., 10:00 AM)
      
      const timeSlot = {
        id: `slot-${hour}`,
        startTime: start, // Store the actual start time
        endTime: end,     // Store the actual end time
        time: `${hour}:00 - ${hour + slotDuration}:00`, // For display purposes
        capacity,
        bookedCount: 0,
      };
      
      slots.push(timeSlot);
    }

    set({ timeSlots: slots });
  },

  // Function to book a delivery
  bookDelivery: (address, timeSlotId) => {
    set((state) => {
      const timeSlot = state.timeSlots.find((slot) => slot.id === timeSlotId);
      
      if (!timeSlot || timeSlot.bookedCount >= timeSlot.capacity) {
        return state;
      }

      const newDelivery = {
        id: `del-${state.deliveries.length + 1}`,
        address,
        timeSlot,
        status: 'pending',
      };

      const updatedTimeSlots = state.timeSlots.map((slot) =>
        slot.id === timeSlotId
          ? { ...slot, bookedCount: slot.bookedCount + 1 }
          : slot
      );

      return {
        timeSlots: updatedTimeSlots,
        deliveries: [...state.deliveries, newDelivery], // Update deliveries state
      };
    });
  },

  // Function to set deliveries
  setDeliveries: (newDeliveries) => {
    set({ deliveries: newDeliveries });
  },

  // Fetch deliveries from the backend
  fetchDeliveries: async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/v1/deliverylist'); // Use correct URL
      set({ deliveries: response.data.deliveries });
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  },
}));
