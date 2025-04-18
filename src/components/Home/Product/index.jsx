import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const shippingCost = 16;

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const handleQuantityChange = (id, delta) => {
    const updatedItems = cartItems.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleRemove = (id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const applyCoupon = () => {
    setDiscount(coupon === "DISCOUNT10" ? 10 : 0);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount + (cartItems.length ? shippingCost : 0);

  // Сохраняем total в localStorage при каждом пересчёте
  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(total));
  }, [total]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead className="border-b">
              <tr className="text-sm text-gray-700">
                <th className="py-2 px-4">Products</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4 flex items-center gap-4">
                    <img src={item.main_image} alt={item.title} className="w-14 h-14 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <span className="text-sm text-gray-500">SKU: {item._id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">${item.price}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cartItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
              <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Let's Shop</Link>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="p-4 border text-center rounded-md shadow-sm">
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Cart Total</h2>

            <div className="flex h-10 mb-4">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code..."
                className="flex-grow border border-[#46A358] px-3 py-2 rounded-l-md placeholder:text-sm placeholder:text-gray-400"
              />
              <button
                onClick={applyCoupon}
                className="bg-[#46A358] text-white px-4 rounded-r-md hover:bg-green-700 transition"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Coupon Discount:</span>
                <span className="text-red-500 font-bold">− ${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-bold">${shippingCost}</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-700">${total.toFixed(2)}</span>
              </div>
            </div>
           <div className="mt-6">
           <Link className="py-2 px-3 bg-[#46A358] text-white rounded-md hover:text-white" disabled={!cartItems.length} to="/product-checkout">Proceed to Checkout</Link>
            <Link to="/" className="block mt-4 w-full text-[#46A358] hover:underline">
              Continue Shopping
            </Link>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}
