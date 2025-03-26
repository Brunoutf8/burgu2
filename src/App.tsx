import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuItem from './components/MenuItem';
import OrderTracker from './components/OrderTracker';
import AdminPanel from './components/AdminPanel';
import { CartProvider } from './contexts/CartContext';
import { Clock, Flame, X } from 'lucide-react';
import { isStoreOpen } from './utils/storage';

const menuItems = [
  {
    name: 'Classic Burger',
    description: 'Hambúrguer artesanal, queijo cheddar, alface, tomate e molho especial',
    price: 32.90,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80'
  },
  {
    name: 'Bacon Supreme',
    description: 'Hambúrguer artesanal, muito bacon, queijo, cebola caramelizada',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80'
  },
  {
    name: 'Mushroom Deluxe',
    description: 'Hambúrguer artesanal, cogumelos salteados, queijo suíço, rúcula',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80'
  },
  {
    name: 'Veggie Special',
    description: 'Hambúrguer de grão de bico, queijo vegano, alface, tomate',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&q=80'
  }
];

const OPENING_HOUR = 18;
const CLOSING_HOUR = 23;

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIfOpen = () => {
      setIsOpen(isStoreOpen());
    };

    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-b from-orange-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex items-center justify-center mb-4">
            {isOpen ? (
              <div className="flex items-center bg-green-500 text-white px-4 py-1 rounded-full">
                <Flame className="h-5 w-5 mr-2 animate-pulse" />
                <span className="font-medium">Aberto Agora</span>
              </div>
            ) : (
              <div className="flex items-center bg-red-500 text-white px-4 py-1 rounded-full">
                <X className="h-5 w-5 mr-2" />
                <span className="font-medium">Fechado</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Os Melhores Burgers da Cidade
          </h1>
          
          <div className="flex items-center justify-center text-white mb-4">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-lg">Funcionamos das 18:00 às 23:00</span>
          </div>
          
          <p className="text-xl text-white mb-8">
            Sabor artesanal em cada mordida
          </p>
          
          <a
            href="#menu"
            className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Cardápio
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nosso Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <MenuItem key={item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Sobre Nós</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Desde 2015, a BurgerHouse tem se dedicado a criar as melhores experiências 
              gastronômicas com hambúrgueres artesanais. Nossos ingredientes são 
              cuidadosamente selecionados e preparados com amor e dedicação.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Contato</h2>
          <div className="max-w-lg mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700">Nome</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700">Mensagem</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-full hover:bg-orange-700 transition-colors"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 BurgerHouse. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order-tracker/:orderId" element={<OrderTracker />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;