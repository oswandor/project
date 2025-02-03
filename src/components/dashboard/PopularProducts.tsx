import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface Product {
  id: number;
  image: string;
  name: string;
  price: number;

}

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart(); // Obtener el dispatch del carrito
  const navigate = useNavigate(); // Obtener la función navigate
  const API_URL = import.meta.env.VITE_API_URL;


  // Fetch productos más populares
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/ecommerce/productos/populares`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch popular products");
        }

        const data = await response.json();

        console.log(JSON.stringify(data));

        setProducts(data);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Manejar la acción de agregar al carrito
  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id, // ID temporal
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        quantity: 1, // Cantidad inicial
      },
    });
  };


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {products.map((product, index) => (
          
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between items-center">
              
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">$ {product.price}</p>
              </div>

              <button onClick={() => navigate(`/product/${product.id}`)}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
