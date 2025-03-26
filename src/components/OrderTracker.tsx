import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { getOrderById } from '../utils/storage';
import { Order } from '../types/order';

const statusIcons = {
  pending: Clock,
  preparing: Clock,
  ready: CheckCircle2,
  delivered: Truck,
  cancelled: XCircle,
};

const statusMessages = {
  pending: 'Pedido Recebido',
  preparing: 'Em Preparo',
  ready: 'Pronto para Retirada',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors = {
  pending: 'text-yellow-500',
  preparing: 'text-blue-500',
  ready: 'text-green-500',
  delivered: 'text-purple-500',
  cancelled: 'text-red-500',
};

export default function OrderTracker() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Pedido não encontrado</h2>
          <p className="mt-2 text-gray-600">O pedido que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id}</h1>
            <div className={`flex items-center ${statusColors[order.status]}`}>
              <StatusIcon className="h-6 w-6 mr-2" />
              <span className="font-medium">{statusMessages[order.status]}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Itens do Pedido</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Informações de Entrega</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Nome:</span> {order.customer.name}</p>
                <p><span className="font-medium">Telefone:</span> {order.customer.phone}</p>
                <p><span className="font-medium">Endereço:</span> {order.customer.address}</p>
                <p><span className="font-medium">CEP:</span> {order.customer.cep}</p>
              </div>
            </div>

            {order.estimatedTime && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">Previsão de Entrega</h2>
                <p className="text-gray-600">{order.estimatedTime}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}