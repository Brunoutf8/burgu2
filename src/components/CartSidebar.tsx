import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Eye, Upload, AlertCircle } from 'lucide-react';
import InputMask from 'react-input-mask';
import { useCart } from '../contexts/CartContext';
import { Order } from '../types/order';
import { saveOrder } from '../utils/storage';
import { formatPhone, formatCEP } from '../utils/masks';
import OrderPreview from './OrderPreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderPDF from './OrderPDF';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutForm {
  name: string;
  phone: string;
  cep: string;
  address: string;
  paymentMethod: 'money' | 'card' | 'pix';
  change?: string;
  pixProof?: string;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    cep: '',
    address: '',
    paymentMethod: 'money',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsCheckingOut(false);
      setShowPreview(false);
      setFormData({
        name: '',
        phone: '',
        cep: '',
        address: '',
        paymentMethod: 'money',
      });
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 11) {
      errors.phone = 'Telefone inválido';
    }

    if (!formData.cep.trim() || formData.cep.replace(/\D/g, '').length < 8) {
      errors.cep = 'CEP inválido';
    }

    if (!formData.address.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (formData.paymentMethod === 'pix' && !formData.pixProof) {
      errors.pixProof = 'Comprovante do PIX é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cep') {
      const cep = value.replace(/\D/g, '');
      if (cep.length === 8) {
        setIsLoading(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              cep: value,
              address: `${data.logradouro}, ${data.bairro}, ${data.localidade}/${data.uf}`
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
        setIsLoading(false);
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, pixProof: reader.result as string }));
        setFormErrors(prev => ({ ...prev, pixProof: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const order: Order = {
      id: Date.now().toString(),
      items,
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        cep: formData.cep,
      },
      payment: {
        method: formData.paymentMethod,
        change: formData.change,
        pixProof: formData.pixProof,
      },
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);

    const message = formatOrderMessage();
    window.open(`https://wa.me/5585989474355?text=${message}`, '_blank');
    onClose();
  };

  const formatOrderMessage = () => {
    const orderItems = items.map(item => 
      `\n- ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})`
    ).join('');

    const message = `
🍔 *NOVO PEDIDO - BURGER HOUSE*
*Cliente:* ${formData.name}
*Telefone:* ${formData.phone}
*Endereço:* ${formData.address}
*CEP:* ${formData.cep}

*Pedido:*${orderItems}

*Forma de Pagamento:* ${
  formData.paymentMethod === 'money' ? 'Dinheiro' + (formData.change ? ` (Troco para R$ ${formData.change})` : '') :
  formData.paymentMethod === 'card' ? 'Cartão' :
  'PIX'
}

*Total do Pedido:* R$ ${total.toFixed(2)}
    `.trim();

    return encodeURIComponent(message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {showPreview ? 'Preview do Pedido' : isCheckingOut ? 'Finalizar Pedido' : 'Carrinho de Compras'}
                </h2>
                <button
                  onClick={onClose}
                  className="ml-3 h-7 w-7 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {showPreview ? (
                <OrderPreview
                  items={items}
                  formData={formData}
                  total={total}
                  onBack={() => setShowPreview(false)}
                />
              ) : !isCheckingOut ? (
                <div className="mt-8">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-500">Seu carrinho está vazio</p>
                    </div>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {items.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 text-gray-400 hover:text-gray-500"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="mx-2 text-gray-700">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 text-gray-400 hover:text-gray-500"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="font-medium text-orange-600 hover:text-orange-500"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome Completo*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefone*
                    </label>
                    <InputMask
                      mask="(99) 99999-9999"
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                      CEP*
                    </label>
                    <InputMask
                      mask="99999-999"
                      type="text"
                      id="cep"
                      name="cep"
                      required
                      value={formData.cep}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.cep ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cep && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cep}</p>
                    )}
                    {isLoading && (
                      <p className="mt-1 text-sm text-gray-500">Buscando endereço...</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Endereço Completo*
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
                        formErrors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Forma de Pagamento*
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      required
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="money">Dinheiro</option>
                      <option value="card">Cartão</option>
                      <option value="pix">PIX</option>
                    </select>
                  </div>

                  {formData.paymentMethod === 'money' && (
                    <div>
                      <label htmlFor="change" className="block text-sm font-medium text-gray-700">
                        Troco para quanto?
                      </label>
                      <input
                        type="text"
                        id="change"
                        name="change"
                        value={formData.change}
                        onChange={handleInputChange}
                        placeholder="Deixe em branco se não precisar de troco"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  )}

                  {formData.paymentMethod === 'pix' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Comprovante do PIX*
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="pixProof"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                            >
                              <span>Upload do comprovante</span>
                              <input
                                id="pixProof"
                                name="pixProof"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                        </div>
                      </div>
                      {formErrors.pixProof && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.pixProof}</p>
                      )}
                      {formData.pixProof && (
                        <p className="mt-2 text-sm text-green-600">✓ Comprovante carregado</p>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Frete e impostos calculados no checkout.
                </p>
                <div className="mt-6 space-y-2">
                  {!isCheckingOut ? (
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors"
                    >
                      Finalizar Pedido
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowPreview(true)}
                        className="w-full flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview do Pedido
                      </button>
                      <PDFDownloadLink
                        document={<OrderPDF items={items} formData={formData} total={total} />}
                        fileName="pedido-burgerhouse.pdf"
                        className="w-full flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar PDF do Pedido')}
                      </PDFDownloadLink>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors"
                      >
                        Enviar Pedido por WhatsApp
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}