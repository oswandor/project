import React, { useState, useEffect } from 'react';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BestSellingSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // Almacena los productos
  const [selectedAudience, setSelectedAudience] = useState<string>('man'); // Público objetivo seleccionado
  const [loading, setLoading] = useState<boolean>(false); // Indicador de carga
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Cargar productos cuando cambie el público objetivo
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/ecommerce/productos/audience/${selectedAudience}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error al cargar los productos');
        }
      } catch (error) {
        console.error('Error de red:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedAudience]);

  return (
    <div className="px-8 py-12 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-8">― Best Selling ―</h2>
        <div className="flex justify-center gap-4">
          {['man', 'woman', 'boy', 'child'].map((audience) => (
            <button
              key={audience}
              onClick={() => setSelectedAudience(audience)}
              className={`px-6 py-2 ${selectedAudience === audience ? 'bg-black text-white' : 'border border-gray-300 text-gray-800'
                } rounded hover:bg-gray-800 hover:text-white`}
            >
              {audience.charAt(0).toUpperCase() + audience.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="relative">
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-black font-semibold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
    
                  <button onClick={() => navigate(`/product/${product.id}`)}
                    className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
                  >
                    <MoveRight className="w-5 h-5" />
                  </button>


                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellingSection;
