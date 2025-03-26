import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';

interface OrderNotificationProps {
  orderId: string;
  estimatedTime: string;
  onClose: () => void;
}

export default function OrderNotification({ orderId, estimatedTime, onClose }: OrderNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 animate-slide-up">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            Pedido {orderId} em Preparo!
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Previsão de entrega: {estimatedTime}
          </p>
          <div className="mt-3">
            <Link
              to={`/order-tracker/${orderId}`}
              className="text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              Acompanhar Pedido →
            </Link>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="rounded-md inline-flex text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}