import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Menu, ChevronLeft, ChevronRight, MoveRight, LogOut, LogIn } from 'lucide-react';
import PopularProducts from '../components/dashboard/PopularProducts';
import BestSellingSection from '../components/dashboard/BestSellingSection';
import { useCart } from '../context/CartContext';
import { Link, Route, useNavigate } from 'react-router-dom';

function StoreFront() {
  const { dispatch } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    try {
      // Obtener los datos del usuario desde localStorage
      const userRaw = localStorage.getItem('user');
  
      // Verificar si el valor existe y analizarlo
      const user = userRaw ? JSON.parse(userRaw) : null;
  
      // Establecer el usuario si es válido
      if (user) {
        setUser(user); // No necesitas volver a convertirlo a JSON, ya es un objeto
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
  
      // Si hay un error al analizar, elimina los datos corruptos
      localStorage.removeItem('user');
    }
  }, []);
  

   // Manejar Logout
   const handleLogout = () => {
    localStorage.removeItem('user'); // Eliminar el usuario de localStorage
    setUser(null); // Actualizar el estado del usuario
    navigate('/'); // Redirigir a la página principal
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="text-2xl font-bold">Slick</div>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <Link to="/shop" className="hover:text-gray-600">Shop</Link>
          <a href="#" className="hover:text-gray-600">Collection</a>
          <a href="#" className="hover:text-gray-600">Customize</a>
        </div>
        <div className="flex items-center space-x-4">


           {/* Mostrar botones de Login y Register si no hay usuario */}
           {!user && (
            <>
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                <Link to="/login">Login</Link>
              </button>
              <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-800 hover:text-white">
                <Link to="/register">Register</Link>
              </button>
            </>
          )}


            {/* Mostrar botón de Logout si hay un usuario */}
            {user && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleLogout}
            >
              <LogOut className="inline w-5 h-5 mr-2" />
              Logout
            </button>
          )}

          <button onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
          </button>
          <Menu className="w-6 h-6 cursor-pointer md:hidden" />

        </div>
      </nav>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 px-8 py-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your<br />
            Sole Mate<br />
            With Us
          </h1>
          <p className="text-gray-600 mb-8">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded w-fit hover:bg-gray-800"
            onClick={() => navigate('/shop')}
          >
          Shop Now
           
          </button>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80"
            alt="White sneaker"
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold">Trendy Slick Pro</h3>
            <p className="text-gray-600">$ 3999.00</p>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="bg-black py-6 px-8">
        <div className="flex justify-between items-center opacity-70">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png" alt="eBay" className="h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Amazon" className="h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2048px-Amazon_icon.svg.png" alt="Ajio" className="h-6 object-contain" />
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-gray-600 mb-2">Our Trending Shoe</p>
            <h2 className="text-3xl font-bold">Most Popular<br />Products</h2>
            <p className="text-gray-600 mt-2 max-w-md">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
            </p>
            <button className="bg-black text-white px-8 py-3 rounded mt-4 hover:bg-gray-800">
              Explore
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <PopularProducts />

      </div>

      {/* Best Selling Section */}
      <BestSellingSection></BestSellingSection>

    </div>
  );
}

export default StoreFront;