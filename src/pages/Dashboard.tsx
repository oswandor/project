import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import Inventory from '../components/dashboard/Inventory';
import Orders from '../components/dashboard/Orders';
import Categories from '../components/dashboard/Categories';
import AddProduct from '../components/dashboard/AddProduct';
import Customers from '../components/dashboard/Customers';
import Reports from '../components/dashboard/Reports';
function Dashboard() {
  

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />

      </Routes>
    </DashboardLayout>
  );
}

export default Dashboard;