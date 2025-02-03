
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/loader.css';


// Define the type for products
type Product = {
  id: number;
  id_producto: number;
  nombre: string;
  precio: string;
  original_price: string;
  category: string;
  imagen: string;
  description: string;
  features: string[];
  sizes: number[];
  colors: string[];
  rating: number;
  reviews: number;
  stock: number;
};



function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado para el loader
  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => { 
    // Fetch product data from API
    const fetchProduct = async () => {
      setLoading(true); // Muestra el loader antes de iniciar la petición

      try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();

        setProduct(data);

        console.log(JSON.stringify(data));

      } catch (error) {
        console.error('Error fetching product:', error);
      }finally {
        setLoading(false); // Oculta el loader cuando la petición finaliza
      }
    };

    fetchProduct();

  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }


  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-black hover:underline"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {

    console.log('Adding to cart:', product);

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id_producto,
        name: product.nombre,
        price: product.precio,
        image: product.imagen,
        quantity: 1,
        size: selectedSize !== null ? selectedSize.toString() : undefined,
      },
    });
    dispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
          <ShoppingBag className="w-6 h-6" />
        </button>
      </nav>

        {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={product.imagen}
                  alt={`${product.nombre} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.nombre}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>
              <span className="text-sm text-green-600">In Stock ({product.stock})</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${product.precio}</span>
              <span className="text-gray-500 line-through">${product.original_price}</span>
              <span className="text-green-600 text-sm">
                {Math.round(
                  ((Number(product.original_price) - Number(product.precio)) /
                    Number(product.original_price)) *
                    100
                )}% OFF
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Truck className="w-4 h-4 mr-2" />
              Free shipping on orders over $99
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Select Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            disabled={!selectedSize || !selectedColor}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;