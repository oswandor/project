import React, { useEffect, useState } from 'react';
import { Search, Filter, Mail, ArrowUpDown, MoreVertical , Trash2  , Edit } from 'lucide-react';
import '../../styles/loader.css'; // Asegúrate de que esta ruta sea correcta

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  rol: string;
  created_at: string;
  updated_at: string;
}

function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const API_URL = import.meta.env.VITE_API_URL; // Usar variable de entorno para la URL

  const fetchUsers = async () => {
    try {
      setLoading(true); // Activar el estado de carga
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleEdit = (user: User) => {
    setEditingUser(user);
    // Here you would typically open a modal or navigate to an edit page
    console.log('Edit user:', user);
  };

  const handleDelete = async (id: number) => {
    try {
      // Here you would connect to your API to delete the user
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      // Refresh the user list or remove the user from the local state
      alert('User deleted successfully!');
      setShowDeleteConfirm(null);
      fetchUsers();

    } catch (error) {
      alert('Failed to delete user. Please try again.');
    }
  };


const handlingExporData = async () => { 
  try {
    const response = await fetch(`${API_URL}/reports/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: users }),
    });

    if (!response.ok) throw new Error('Failed to export data');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.pdf';
    a.click();

  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800" onClick={handlingExporData}>
          Export Data
        </button>
      </div>

      {/* Mostrar spinner mientras carga */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Filters and Search */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Customer Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border-b">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold mt-1">{users.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Verified Customers</p>
              <p className="text-2xl font-semibold mt-1">
                {users.filter((user) => user.email_verified_at).length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Unverified Customers</p>
              <p className="text-2xl font-semibold mt-1">
                {users.filter((user) => !user.email_verified_at).length}
              </p>
            </div>
          </div>

          {/* Customer Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort('name')}
                    >
                      Customer
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort('created_at')}
                    >
                      Joined Date
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.rol}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          user.email_verified_at
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-gray-600 hover:text-black transition-colors"
                        title="Edit customer"
                      >
                        
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete customer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} customers
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
      )}




            {/* Delete Confirmation Modal */}
            {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    
    </div>



  );
}

export default Customers;
