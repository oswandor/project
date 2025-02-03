import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import '../../styles/loader.css';



type Order = {
  Order_ID: string;
  Customer: string;
  Date: string;
  Total: string;
  Status: string;
  Items: number;
};


function Orders() {

  const [Orders, SetOrders ]  = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Nuevo estado para controlar la carga
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para la búsqueda
  
  const API_URL = import.meta.env.VITE_API_URL; // Usar variable de entorno para la URL


  useEffect(() => {
    // Llamar a la API de ventas
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/listaOrdenes`);
        const data = await response.json();
        console.log('Orders:', data);

        SetOrders(data.data);

      } catch (error) {
        console.error('Error fetching orders:', error);
      }finally {
        setLoading(false);
      }
    };

    fetchOrders();
  } , []);


  const filteredOrders = Orders.filter((order) =>
    order.Customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.Order_ID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">

        {loading ? ( // Mostrar spinner mientras carga
            <div className="flex justify-center items-center py-10">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : filteredOrders.length === 0 ? ( // Si no hay productos, mostrar mensaje
            <div className="p-6 text-center text-gray-500">No products available.</div>
          ) : (

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.Order_ID} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 text-sm font-medium text-black">
                    {order.Order_ID}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.Customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.Date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.Items} items</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${order.Total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        order.Status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.Status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1 to 3 of 3 results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;