import { create } from 'zustand';
import { addHours, startOfTomorrow } from 'date-fns';

export const useDeliveryStore = create((set) => ({
  timeSlots: [],
  deliveries: [],
  
  generateTimeSlots: () => {
    const slots = [];
    let startTime = startOfTomorrow();
    
    for (let i = 0; i < 8; i++) {
      slots.push({
        id: `slot-${i}`,
        startTime: addHours(startTime, i * 2),
        endTime: addHours(startTime, (i * 2) + 2),
        capacity: 5,
        bookedCount: 0
      });
    }
    
    set({ timeSlots: slots });
  },
  
  bookDelivery: (address, timeSlotId) => {
    set((state) => {
      const timeSlot = state.timeSlots.find(slot => slot.id === timeSlotId);
      if (!timeSlot || timeSlot.bookedCount >= timeSlot.capacity) {
        return state;
      }
      
      const newDelivery = {
        id: `del-${state.deliveries.length + 1}`,
        address,
        timeSlot,
        status: 'pending'
      };
      
      const updatedTimeSlots = state.timeSlots.map(slot =>
        slot.id === timeSlotId
          ? { ...slot, bookedCount: slot.bookedCount + 1 }
          : slot
      );
      
      return {
        timeSlots: updatedTimeSlots,
        deliveries: [...state.deliveries, newDelivery]
      };
    });
  }
}));
