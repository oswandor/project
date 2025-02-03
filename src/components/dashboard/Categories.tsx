import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Sports',
    products: 45,
    description: 'Athletic and sports footwear',
  },
  {
    id: 2,
    name: 'Formal',
    products: 32,
    description: 'Business and formal occasions',
  },
  {
    id: 3,
    name: 'Casual',
    products: 28,
    description: 'Everyday casual wear',
  },
];

function Categories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{category.name}</h3>
              <div className="flex items-center gap-2">
                <button className="text-gray-600 hover:text-black">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{category.products} products</span>
              <button className="text-black hover:underline">View Products</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;