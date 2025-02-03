import React, { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, Filter } from 'lucide-react';

type ReportType = 'sales' | 'inventory' | 'customers' | 'products';
type DateRange = 'today' | 'week' | 'month' | 'year' | 'custom';

function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: '',
  });

  const API_URL = import.meta.env.VITE_API_URL;
 
  const handleExport = async () => {
    try {

      console.log("Custom Date Range.." ,  JSON.stringify(customDateRange));

      // Here you would connect to your API to generate the report
      const response = await fetch(`${API_URL}/reports/${selectedReport}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange,
          ...(dateRange === 'custom' && { customDateRange }),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedReport}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Types */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Available Reports</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select the type of report you want to generate
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setSelectedReport('sales')}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedReport === 'sales'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Sales Report</p>
                    <p className="text-sm opacity-80">
                      Detailed sales analysis from your ReporteVentas view
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedReport('products')}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedReport === 'products'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Products Report</p>
                    <p className="text-sm opacity-80">
                      Best-selling products from ProductosMasVendidos view
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedReport('inventory')}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedReport === 'inventory'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Inventory Report</p>
                    <p className="text-sm opacity-80">
                      Current stock levels and low stock alerts
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedReport('customers')}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedReport === 'customers'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Customers Report</p>
                    <p className="text-sm opacity-80">
                      Customer purchase history and analysis
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Report Options */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Report Options</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure your report parameters
            </p>
          </div>
          <div className="p-6 space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  onClick={() => setDateRange('today')}
                  className={`px-4 py-2 rounded-lg border ${
                    dateRange === 'today'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setDateRange('week')}
                  className={`px-4 py-2 rounded-lg border ${
                    dateRange === 'week'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setDateRange('month')}
                  className={`px-4 py-2 rounded-lg border ${
                    dateRange === 'month'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      value={customDateRange.start}
                      onChange={(e) =>
                        setCustomDateRange({ ...customDateRange, start: e.target.value })
                      }
                      className="w-full rounded-lg border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={customDateRange.end}
                      onChange={(e) =>
                        setCustomDateRange({ ...customDateRange, end: e.target.value })
                      }
                      className="w-full rounded-lg border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <Calendar className="w-8 h-8 mb-4" />
          <h3 className="font-medium mb-2">Scheduled Reports</h3>
          <p className="text-sm text-gray-600 mb-4">
            Set up automated report generation and delivery
          </p>
          <button className="text-black hover:underline text-sm">
            Configure Schedule →
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <Filter className="w-8 h-8 mb-4" />
          <h3 className="font-medium mb-2">Custom Filters</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create and save custom report filters
          </p>
          <button className="text-black hover:underline text-sm">
            Manage Filters →
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <FileSpreadsheet className="w-8 h-8 mb-4" />
          <h3 className="font-medium mb-2">Report Templates</h3>
          <p className="text-sm text-gray-600 mb-4">
            Save and load custom report templates
          </p>
          <button className="text-black hover:underline text-sm">
            View Templates →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;