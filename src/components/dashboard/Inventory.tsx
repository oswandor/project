import React, { useEffect , useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/loader.css';

type Product = {
  id_producto: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: string;
  stock: number;
  estado: string;
};


function Inventory() {

  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); // Nuevo estado para controlar la carga
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para la búsqueda

  const API_URL = import.meta.env.VITE_API_URL; // Usar variable de entorno para la URL

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/productos`);

        console.log(response.data);

        setProducts(response.data);

      } catch (error) {
        console.error('Error de red:', error);
      }finally {
        setLoading(false);
      }

    };

    fetchProducts();
  } , []);


    // Filtrar productos según la búsqueda
    const filteredProducts = products.filter((product) =>
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800" >
          <Plus className="w-5 h-5" />
          <Link to="/admin/add-product">
          Add Product
          </Link>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"  />
                <input
                  type="text"
                  placeholder="Search products..."
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
          ) : filteredProducts.length === 0 ? ( // Si no hay productos, mostrar mensaje
            <div className="p-6 text-center text-gray-500">No products available.</div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id_producto}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg" />
                      <span className="font-medium">{product.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.categoria}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${product.precio}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        product.estado === 'In Stock'
                          ? 'bg-green-100 text-green-700'
                          : product.estado === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-600 hover:text-black">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-gray-600 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            )}

        </div>

      

        <div className="px-6">        
        
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} results
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
          </div>
  );
}

export default Inventory;