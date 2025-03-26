import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface OrderPreviewProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  formData: {
    name: string;
    phone: string;
    address: string;
    cep: string;
    paymentMethod: string;
    change?: string;
  };
  total: number;
  onBack: () => void;
}

export default function OrderPreview({ items, formData, total, onBack }: OrderPreviewProps) {
  return (
    <div className="mt-8">
      <button
        onClick={onBack}
        className="flex items-center text-orange-600 hover:text-orange-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </button>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Cliente</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome:</dt>
              <dd className="text-sm text-gray-900">{formData.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Telefone:</dt>
              <dd className="text-sm text-gray-900">{formData.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CEP:</dt>
              <dd className="text-sm text-gray-900">{formData.cep}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Endereço:</dt>
              <dd className="text-sm text-gray-900">{formData.address}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h3>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity}x R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pagamento</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Método:</dt>
              <dd className="text-sm text-gray-900">
                {formData.paymentMethod === 'money' && 'Dinheiro'}
                {formData.paymentMethod === 'card' && 'Cartão'}
                {formData.paymentMethod === 'pix' && 'PIX'}
              </dd>
            </div>
            {formData.paymentMethod === 'money' && formData.change && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Troco para:</dt>
                <dd className="text-sm text-gray-900">R$ {formData.change}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Total:</dt>
              <dd className="text-lg font-bold text-orange-600">R$ {total.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}