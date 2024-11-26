import React from 'react';
import { format } from 'date-fns';
import { useDeliveryStore } from '../stores/useDeliveryStore';

export const DeliveryList = () => {
  const { deliveries } = useDeliveryStore();

  return (
    <div className="max-w-2xl mx-auto p-6">
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
                  {format(delivery.timeSlot.startTime, 'PPP')}
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
        
        {deliveries.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No deliveries scheduled yet
          </p>
        )}
      </div>
    </div>
  );
};
