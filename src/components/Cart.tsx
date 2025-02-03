import React from 'react';
import { X, Plus, Minus, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { state, dispatch } = useCart();
  const API_URL = import.meta.env.VITE_API_URL; // Usar variable de entorno para la URL


  const subtotal = state.items.reduce(
    (sum: number, item: { price: string; quantity: number }) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const shipping = 99;
  const total = subtotal + shipping;

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };


  const handleCheckout = async () => {
    try {
      // Obtener el usuario desde localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const id_cliente = user.id;

      if (!id_cliente) {
        throw new Error('Cliente no autenticado.');
      }

      console.log(
        state.items.map((item: { id: number; image: string; name: string; price: string; quantity: number; size?: string }) => ({
          id: item.id,
          image: item.image,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        }))
      );
      
      // Preparar los datos para la API
      const productos = state.items.map((item: { id: number; quantity: number }) => ({
        id_producto: item.id,
        cantidad: item.quantity,
      }));

      const requestData = {
        id_cliente,
        productos,
      };


      console.log('Request data:', JSON.stringify(requestData));

      // Llamar a la API de ventas
      const response = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al realizar la venta.');
        } else {
          const errorText = await response.text();
          throw new Error(`Error inesperado: ${errorText}`);
        }
      }

      const data = await response.json();

      // Éxito: limpiar el carrito

      alert('Venta registrada con éxito.');

      dispatch({ type: 'REMOVE_ITEM', payload: data });

    } catch (error) {
      console.error('Error durante el checkout:', error);
      if (error instanceof Error) {
        alert(error.message || 'Error desconocido durante el checkout.');
      } else {
        alert('Error desconocido durante el checkout.');
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => dispatch({ type: 'TOGGLE_CART' })}
        />
      )}

      {/* Cart Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-gray-500">Start adding some items to your cart</p>
              </div>
            ) : (
              state.items.map((item: { id: number; image: string; name: string; price: string; quantity: number; size?: string }) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    <p className="text-sm font-medium mt-1">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={state.items.length === 0}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;