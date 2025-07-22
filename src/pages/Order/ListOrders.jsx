import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteOrder,
  updateOrder,
} from "../../features/actions/orderAction";

const ListOrders = () => {
  const dispatch = useDispatch();
  const { orderList = [], isLoading } = useSelector((state) => state.order); // Fallback to empty array

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [editForm, setEditForm] = useState({
    notes: "",
  });

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditForm({ notes: order.notes || "" });
    setEditModalOpen(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setConfirmDelete(true);
  };

  const confirmDeleteOrder = () => {
    dispatch(deleteOrder(selectedOrder._id));
    setConfirmDelete(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = () => {
    dispatch(
      updateOrder({
        id: selectedOrder._id,
        status: selectedOrder.status, // Preserve current status
        notes: editForm.notes,
      })
    );
    setEditModalOpen(false);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Orders</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : orderList.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Order ID</th>
              <th className="border px-3 py-2">Customer</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Total (₹)</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order, index) => (
              <tr key={order._id}>
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{order.orderId}</td>
                <td className="border px-3 py-2">{order.customerInfo?.name}</td>
                <td className="border px-3 py-2">
                  {order.customerInfo?.email}
                </td>
                <td className="border px-3 py-2">{order.orderTotal}</td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleView(order)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="text-yellow-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold mb-4">View Order</h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder.customerInfo?.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.customerInfo?.email}
            </p>
            <p>
              <strong>Company:</strong>{" "}
              {selectedOrder.customerInfo?.companyName}
            </p>
            <p>
              <strong>Shipping Address:</strong>
            </p>
            <ul className="ml-4 text-sm text-gray-700">
              <li>{selectedOrder.customerInfo?.shippingAddress?.line1}</li>
              <li>{selectedOrder.customerInfo?.shippingAddress?.city}</li>
              <li>{selectedOrder.customerInfo?.shippingAddress?.postalCode}</li>
              <li>{selectedOrder.customerInfo?.shippingAddress?.country}</li>
            </ul>
            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="ml-4 mt-2 text-sm text-gray-800">
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.name} ({item.sku}) - {item.quantity} x ₹
                    {item.selectedPack?.price} [{item.selectedPack?.unit}]
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-2">
              <strong>Total:</strong> ₹{selectedOrder.orderTotal}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Notes:</strong> {selectedOrder.notes || "None"}
            </p>
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-2 right-2 text-red-600"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <h3 className="text-lg font-semibold mb-4">Edit Order Notes</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-2 text-red-600"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm text-center">
            <h4 className="text-lg font-semibold mb-4">Delete this order?</h4>
            <p className="mb-4">Order ID: {selectedOrder.orderId}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
