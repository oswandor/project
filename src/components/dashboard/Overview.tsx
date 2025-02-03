import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import '../../styles/loader.css';


const iconMap: { [key: string]: React.ElementType } = {
  DollarSign: DollarSign,
  Package: Package,
  ShoppingCart: ShoppingCart,
  TrendingUp: TrendingUp,
};


type data = {
  name: string;
  sales: number;
}

type State = {
  name: string;
  value: string;
  change: string;
  icon: string;
}

type recentOrders = {
  order_id: number,
  order_date: string,
  items_count: number,
  total_amount: string,
  customer_name: string
}

type lowStockAlert = {
  product_id: number,
  product_name: string,
  product_sku: string,
  current_stock: number,
  minimum_stock: number
}

function Overview() {
  const [state, setState] = useState<State[]>([]);
  const API_URL = import.meta.env.VITE_API_URL; // Usar variable de entorno para la URL
  const [data, setdata] = useState<data[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingSales, setLoadingSales] = useState<boolean>(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [loadingLowStock, setLoadingLowStock] = useState<boolean>(true);

  const [recentOrders, setRecentOrders] = useState<recentOrders[]>([]);
  const [lowStockAlert, setLowStockAlert] = useState<lowStockAlert[]>([]);


  useEffect(() => {
    document.title = 'Dashboard - Overview';

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch(`${API_URL}/estadisticas`);
        const stats = await response.json();
        setState(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchSalesSummary = async () => {
      try {
        setLoadingSales(true);
        const response = await fetch(`${API_URL}/sales-summary`);
        const ventas = await response.json();
        setdata(ventas.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoadingSales(false);
      }
    };


    const fetchRecentOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await fetch(`${API_URL}/recent-orders`);
        const orders = await response.json();
        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    }

    const fetchLowStockAlert = async () => {
      try {
        setLoadingLowStock(true);
        const response = await fetch(`${API_URL}/low-stock-alert`);
        const lowStock = await response.json();
        setLowStockAlert(lowStock);
      } catch (error) {
        console.error('Error fetching low stock alert:', error);
      } finally {
        setLoadingLowStock(false);
      }
    }


    fetchStats();
    fetchSalesSummary();
    fetchRecentOrders();
    fetchLowStockAlert();


  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
          <div className="col-span-4 flex justify-center py-10">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (

          state.map((stat) => {
            const IconComponent = iconMap[stat.icon];
            return (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold mt-1">$ {stat.value}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">
                    {stat.change}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">vs last month</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">Sales Overview</h3>
        <div className="h-80">
          {loadingSales ? (
            <div className="flex justify-center items-center py-10">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="flex justify-center py-10">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-600">No recent orders available.</p>
            ) : (

              recentOrders.map((order) => (
                <div key={order.order_id} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 rounded-lg" />
                    <div>
                      <p className="font-medium">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">{order.items_count} items • ${order.total_amount}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                    Delivered
                  </span>
                </div>
              ))
            )}

          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Low Stock Alert</h3>
          <div className="space-y-4">
            {loadingLowStock ? (
              <div className="flex justify-center py-10">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            ) : lowStockAlert.length === 0 ? (
              <p className="text-sm text-gray-600">No low stock products found.</p>
            ) : (
              
                lowStockAlert.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg" />
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">SKU: RS-{item.product_sku}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full">
                      3 left
                    </span>
                  </div>
                   ))
                  )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;