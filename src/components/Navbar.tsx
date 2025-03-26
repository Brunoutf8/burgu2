import React, { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount, total } = useCart();

  return (
    <>
      <nav className="bg-orange-600 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">BurgerHouse</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <a href="#home" className="text-white hover:text-orange-200">Home</a>
                <a href="#menu" className="text-white hover:text-orange-200">Menu</a>
                <a href="#about" className="text-white hover:text-orange-200">Sobre</a>
                <a href="#contact" className="text-white hover:text-orange-200">Contato</a>
              </div>
            </div>

            {/* Cart button - Always visible */}
            <div className="flex items-center space-x-2">
              <button 
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                {itemCount > 0 && (
                  <span className="text-orange-600 font-medium">
                    R$ {total.toFixed(2)}
                  </span>
                )}
              </button>
              
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white hover:text-orange-200"
                >
                  {isOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-orange-600">
              <a href="#home" className="block text-white hover:text-orange-200 px-3 py-2">Home</a>
              <a href="#menu" className="block text-white hover:text-orange-200 px-3 py-2">Menu</a>
              <a href="#about" className="block text-white hover:text-orange-200 px-3 py-2">Sobre</a>
              <a href="#contact" className="block text-white hover:text-orange-200 px-3 py-2">Contato</a>
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}