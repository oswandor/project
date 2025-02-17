import React, { useState ,useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categories = ["All", "Sports", "Formal", "Casual", "Running", "Walking"];
const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];


interface Product {
  id_producto: number;
  nombre: string;
  precio: string;
  originalPrice: string;
  categoria: string;
  imagen: string;
  isNew: boolean;
  rating: number;
  reviews: number;
}


function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const URL_API = import.meta.env.VITE_API_URL;

  const { dispatch } = useCart();

    // Fetch products from API
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${URL_API}/productos`);
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  
  // Filter products by category
  const filteredProducts = products.filter((product) =>
    selectedCategory === "All" || product.categoria === selectedCategory
  );

  // Sort products by the selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "Price: Low to High":
        return parseFloat(a.precio) - parseFloat(b.precio);
      case "Price: High to Low":
        return parseFloat(b.precio) - parseFloat(a.precio);
      case "Most Popular":
        return b.rating - a.rating;
      default: // "Newest"
        return b.id_producto - a.id_producto;
    }
  });

  // Search products by query
  const searchedProducts = sortedProducts.filter((product) =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
    const handleAddToCart = (product: Product) => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id_producto,
          name: product.nombre,
          price: product.precio, // Convert price to number
          image: product.imagen,
          quantity: 1,
        },
      });

      dispatch({ type: "TOGGLE_CART" });
    };
  
    if (loading) {
      return <div className="text-center py-16">Loading products...</div>;
    }
  
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="text-2xl font-bold">Ulices shoes</div>
        <div className="hidden md:flex space-x-8">
          <a href="/" className="hover:text-gray-600">Inicio</a>
          <a href="/shop" className="text-black font-medium">Tienda</a>
          <a href="#" className="hover:text-gray-600">Colección</a>
          <a href="#" className="hover:text-gray-600">Personalizar</a>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-6 h-6 cursor-pointer" />
          <button onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-100 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Todos los Zapatos</h1>
          <p className="text-gray-600 max-w-2xl">
          Descubre nuestra colección de calzado de primera calidad. Desde calzado deportivo hasta calzado formal, encuentra tu par perfecto.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-8 py-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shoes..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className="relative w-full md:w-48">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-black"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 py-4 border-t">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {searchedProducts.map((product) => (
            <div key={product.id_producto} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                <img
                  src={product.imagen.startsWith('/storage/productos/') ? `https://inventoryshoessonso.azurewebsites.net${product.imagen}` : product.imagen}
                  alt={product.nombre}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{product.nombre}</h3>
                    <p className="text-sm text-gray-500">{product.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.precio}</p>
                    <p className="text-sm text-gray-500 line-through">{product.originalPrice}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default Shop;










