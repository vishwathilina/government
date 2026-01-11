"use client";

import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface InventoryItem {
  itemId: string;
  itemName: string;
  itemCode: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  reorderLevel: number;
  unitPrice: number;
  warehouseId: string;
  warehouseName?: string;
  status: string;
}

interface ItemFormData {
  itemName: string;
  itemCode: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  reorderLevel: number;
  unitPrice: number;
  warehouseId: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    itemName: "",
    itemCode: "",
    category: "METER",
    quantity: 0,
    unitOfMeasure: "PCS",
    reorderLevel: 10,
    unitPrice: 0,
    warehouseId: 1,
  });

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    categories: 0,
  });

  useEffect(() => {
    fetchItems();
  }, [page, searchTerm, categoryFilter, statusFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockItems: InventoryItem[] = [
        {
          itemId: "1",
          itemName: "Electric Meter - Single Phase",
          itemCode: "MTR-SP-001",
          category: "METER",
          quantity: 45,
          unitOfMeasure: "PCS",
          reorderLevel: 20,
          unitPrice: 2500,
          warehouseId: "1",
          warehouseName: "Main Warehouse",
          status: "ACTIVE",
        },
        {
          itemId: "2",
          itemName: "Electric Meter - Three Phase",
          itemCode: "MTR-TP-001",
          category: "METER",
          quantity: 12,
          unitOfMeasure: "PCS",
          reorderLevel: 15,
          unitPrice: 4500,
          warehouseId: "1",
          warehouseName: "Main Warehouse",
          status: "LOW_STOCK",
        },
        {
          itemId: "3",
          itemName: "Water Meter",
          itemCode: "MTR-WTR-001",
          category: "METER",
          quantity: 30,
          unitOfMeasure: "PCS",
          reorderLevel: 10,
          unitPrice: 1800,
          warehouseId: "1",
          warehouseName: "Main Warehouse",
          status: "ACTIVE",
        },
        {
          itemId: "4",
          itemName: "Copper Wire 10mm",
          itemCode: "WIRE-CU-10",
          category: "CABLE",
          quantity: 500,
          unitOfMeasure: "MTR",
          reorderLevel: 100,
          unitPrice: 50,
          warehouseId: "1",
          warehouseName: "Main Warehouse",
          status: "ACTIVE",
        },
        {
          itemId: "5",
          itemName: "PVC Pipe 50mm",
          itemCode: "PIPE-PVC-50",
          category: "PIPE",
          quantity: 8,
          unitOfMeasure: "PCS",
          reorderLevel: 15,
          unitPrice: 350,
          warehouseId: "2",
          warehouseName: "Field Warehouse",
          status: "LOW_STOCK",
        },
      ];

      let filtered = mockItems;
      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (categoryFilter) {
        filtered = filtered.filter((item) => item.category === categoryFilter);
      }
      if (statusFilter) {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }

      setItems(filtered);
      setTotalPages(1);

      const lowStock = filtered.filter((item) => item.quantity <= item.reorderLevel);
      const totalValue = filtered.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const categories = new Set(filtered.map((item) => item.category)).size;

      setStats({
        totalItems: filtered.length,
        lowStock: lowStock.length,
        totalValue,
        categories,
      });
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        alert("Item updated successfully!");
      } else {
        alert("Item created successfully!");
      }
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchItems();
    } catch (error: any) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      itemCode: item.itemCode,
      category: item.category,
      quantity: item.quantity,
      unitOfMeasure: item.unitOfMeasure,
      reorderLevel: item.reorderLevel,
      unitPrice: item.unitPrice,
      warehouseId: parseInt(item.warehouseId),
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        alert("Item deleted successfully!");
        fetchItems();
      } catch (error: any) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      itemCode: "",
      category: "METER",
      quantity: 0,
      unitOfMeasure: "PCS",
      reorderLevel: 10,
      unitPrice: 0,
      warehouseId: 1,
    });
  };

  const getStatusBadge = (status: string, quantity: number, reorderLevel: number) => {
    const isLowStock = quantity <= reorderLevel;
    if (isLowStock) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CubeIcon className="w-4 h-4 mr-1" />
        In Stock
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage warehouse items and stock levels</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <CubeIcon className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
            </div>
            <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                LKR {stats.totalValue.toLocaleString()}
              </p>
            </div>
            <ArchiveBoxIcon className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
            </div>
            <ArchiveBoxIcon className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              <option value="METER">Meter</option>
              <option value="CABLE">Cable</option>
              <option value="PIPE">Pipe</option>
              <option value="TOOL">Tool</option>
              <option value="SAFETY">Safety Equipment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setStatusFilter("");
                setPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">No items found</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.itemId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitOfMeasure}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">LKR {item.unitPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      LKR {(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status, item.quantity, item.reorderLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(item.itemId)} className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Code *</label>
                  <input
                    type="text"
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="METER">Meter</option>
                    <option value="CABLE">Cable</option>
                    <option value="PIPE">Pipe</option>
                    <option value="TOOL">Tool</option>
                    <option value="SAFETY">Safety Equipment</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="PCS">Pieces</option>
                    <option value="MTR">Meters</option>
                    <option value="KG">Kilograms</option>
                    <option value="LTR">Liters</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level *</label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {editingItem ? "Update" : "Add"} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
