import React from 'react';
import { useCart } from '../contexts/CartContext';

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function MenuItem({ name, description, price, image }: MenuItemProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: name, // Using name as ID for simplicity
      name,
      price,
      image
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">R$ {price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}