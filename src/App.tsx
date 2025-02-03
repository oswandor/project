import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import StoreFront from './pages/StoreFront';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Shop from './pages/Shop';
import Cart from './components/Cart';
import ProductDetails from './pages/ProductDetails';
import Register from './pages/Register';
import ProtectedRoute from './context/ProtectedRoute';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={
            <ProtectedRoute role="Administrador">
              <Dashboard />
            </ProtectedRoute>
          } />
      </Routes>

      <Cart />
    </CartProvider>
  );
}

export default App;
