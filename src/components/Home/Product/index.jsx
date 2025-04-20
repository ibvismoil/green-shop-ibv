import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Empty, notification } from "antd";  // Импортируем компонент notification из Ant Design

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const api = import.meta.env.VITE_API;
  const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;
  const [loadingCoupon, setLoadingCoupon] = useState(false);
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

  const applyCoupon = async () => {
    if (!coupon) return;
    setLoadingCoupon(true);
    try {
      const res = await fetch(`${api}features/coupon?access_token=${apikey}&coupon_code=${coupon}`);
      const data = await res.json();

      if (res.ok && data && typeof data.discount === 'number') {
        setDiscount(data.discount);

        notification.success({
          message: 'Coupon Applied!',
          description: `You have received a discount of $${data.discount.toFixed(2)}.`,
          placement: 'topRight',
        });
      } else {
        setDiscount(0);
        notification.error({
          message: 'Invalid Coupon',
          description: 'The coupon code is either invalid or expired.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      notification.error({
        message: 'Failed to Apply Coupon',
        description: 'There was an error while applying the coupon. Please try again.',
        placement: 'topRight',
      });
    } finally {
      setLoadingCoupon(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount + (cartItems.length ? shippingCost : 0);

  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(total));
  }, [total]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <span className="font-semibold size-4"><Link className="text-gray-500" to="/">Home </Link>/ Shoping Cart</span>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="mt-[12px] lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="border-b border-green-600">
              <tr className="text-black font-mono">
                <th className="py-2 px-2 sm:px-4">Products</th>
                <th className="py-2 px-2 sm:px-4">Price</th>
                <th className="py-2 px-2 sm:px-4">Quantity</th>
                <th className="py-2 px-2 sm:px-4">Total</th>
                <th className="py-2 px-2 sm:px-4"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-2 sm:px-4 flex items-center gap-3 sm:gap-4">
                    <img src={item.main_image} alt={item.title} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">{item.title}</p>
                      <span className="text-xs text-gray-500">SKU: {item._id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">${item.price}</td>
                  <td className="py-3 px-2 sm:px-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <button onClick={() => handleRemove(item._id)} className="">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cartItems.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Empty className="pb-5" description="No products" />
              <Link to="/" className="bg-green-600 mt-5 text-white px-6 py-2 rounded hover:text-white hover:bg-green-700 transition">
                Let's Shop
              </Link>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="p-4  ">
            <h2 className="font-bold text-lg border-green-600 border-b pb-2 mb-4">Card Total</h2>
            <div className="flex flex-col sm:flex-row h-auto sm:h-10 mb-4">
              <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon code..." className="flex-grow border border-[#46A358] px-3 py-2 rounded-t-md sm:rounded-l-md sm:rounded-tr-none sm:rounded-bl-md placeholder:text-sm placeholder:text-gray-400" />
              <button onClick={applyCoupon} className="bg-[#46A358] text-white px-4 py-2 sm:py-0 rounded-b-md sm:rounded-r-md sm:rounded-bl-none hover:bg-green-700 transition disabled:opacity-60" disabled={loadingCoupon}>
                {loadingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>

            <div className="space-y-2 py-2 text-sm">
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
              <div className="flex justify-between border-t pt-3 text-base sm:text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-700">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link to="/product-checkout" className={`block py-2 px-3 text-center rounded-md text-white w-full ${!cartItems.length ? "bg-gray-400 pointer-events-none cursor-not-allowed" : "bg-[#46A358] hover:text-green-50 translate-x-2 hover:bg-green-700"}`}>
                Proceed to Checkout
              </Link>
              <Link to="/" className="block w-full text-[#46A358] text-center hover:text-green-400 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
