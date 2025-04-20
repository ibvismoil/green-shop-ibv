import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate(); 
  const api = import.meta.env.VITE_API;
  const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
    town: "",
    street_address: "",
    additional_street_address: "",
    state: "",
    zip: "",
    email: "",
    phone_number: "",
    payment_method: "card",
    order_notes: "",
  });

  const shippingCost = 16;

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    const savedTotal = JSON.parse(localStorage.getItem("total")) || 0;
    setCartItems(items);
    setTotal(savedTotal);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const applyCoupon = () => {
    setDiscount(coupon === "DISCOUNT10" ? 10 : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("total:", total);
    console.log("shippingCost:", shippingCost);
    console.log("discount:", discount);
  
    const calculatedTotal = total + shippingCost - (total * discount) / 100;
    console.log("calculatedTotal:", calculatedTotal);
  
    const orderData = {
      shop_list: cartItems.map((item) => ({
        product_id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      billing_address: {
        ...formData,
      },
      extra_shop_info: {
        payment_method: formData.payment_method,
        order_notes: formData.order_notes,
        total: calculatedTotal,
        totalPrice: calculatedTotal
      },
    };
  
    console.log("orderData:", orderData);
  
    try {
      const response = await fetch(
        `${api}order/make-order?access_token=${apikey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
  
      const textResponse = await response.text(); // Получаем текстовый ответ сначала
      console.log("Raw response:", textResponse);
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      // Проверяем, если ответ не пустой и можем парсить JSON
      const result = textResponse ? JSON.parse(textResponse) : {};
  
      console.log("Server response:", result);
  
      if (result && response.ok) {
        notification.success({
          message: "Order Placed",
          description: "Your order has been placed successfully!",
        });
  
        localStorage.removeItem("cart");
        localStorage.removeItem("total");
        setCartItems([]);
        setTotal(0);
  
        setTimeout(() => {
          navigate("/profile/track");
        }, 1500);
      } else {
        notification.error({
          message: "Order Failed",
          description: result.extraMessage || JSON.stringify(result),
        });
      }
    } catch (error) {
      console.error("Error while placing the order:", error);
      notification.error({
        message: "Order Failed",
        description: `Error while placing the order: ${error.message}`,
      });
    }
  };
  
  

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = subtotal - discount + (cartItems.length ? shippingCost : 0);

  return (
    <div className="mt-[30px] flex flex-col lg:flex-row gap-9">
      <div className="lg:w-[60%] w-full">
        <h3 className="font-bold mb-5 text-lg">Billing Address</h3>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            {[
              ["first_name", "First name"],
              ["last_name", "Last name"],
              ["country", "Country / Region"],
              ["town", "Town / City"],
              ["street_address", "Street Address"],
              ["additional_street_address", "Apartment, suite, unit, etc. (optional)", false],
              ["state", "State"],
              ["zip", "ZIP Code"],
              ["email", "Email Address"],
            ].map(([name, label, required = true]) => (
              <div key={name} className="w-full sm:w-[calc(50%-8px)]">
                <label htmlFor={name} className="block mb-1">{label}</label>
                <input
                  id={name}
                  name={name}
                  type={name === "email" ? "email" : "text"}
                  placeholder={label}
                  className="ant-input w-full px-3 py-2 border rounded-lg"
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                />
              </div>
            ))}
            <div className="w-full sm:w-[calc(50%-8px)]">
              <label htmlFor="phone_number" className="block mb-1">Phone Number</label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l bg-gray-100 text-sm">+998</span>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  placeholder="Phone number"
                  className="ant-input w-full px-3 py-2 border rounded-r-lg"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block mb-2">Payment Method</label>
              <div className="flex flex-col gap-3">
                <label className="ant-radio-wrapper border border-[#46A358] w-full h-[40px] flex items-center pl-2 rounded-lg">
                  <input type="radio" name="payment_method" value="card" className="ant-radio-input mr-2" defaultChecked onChange={handleChange} />
                  <img src="https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Fimages%2Fpayment_collected_methods.png?alt=media&token=c4bfd991-8bd8-4e6b-97dc-83381db193f7" alt="methods" />
                </label>
                <label className="ant-radio-wrapper border border-[#46A358] w-full h-[40px] flex items-center pl-2 rounded-lg">
                  <input type="radio" name="payment_method" value="bank" className="ant-radio-input mr-2" onChange={handleChange} />
                  Direct bank transfer
                </label>
                <label className="ant-radio-wrapper border border-[#46A358] w-full h-[40px] flex items-center pl-2 rounded-lg">
                  <input type="radio" name="payment_method" value="cod" className="ant-radio-input mr-2" onChange={handleChange} />
                  Cash on delivery
                </label>
              </div>
            </div>
            <div className="w-full mt-4">
              <label htmlFor="order_notes" className="block mb-1">Order notes (optional)</label>
              <textarea
                id="order_notes"
                name="order_notes"
                rows="6"
                placeholder="Your order notes, thoughts, feedback, etc..."
                className="ant-input px-3 py-2 border rounded-lg w-full"
                value={formData.order_notes}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="bg-[#46A358] text-white mt-10 w-full h-[40px] rounded-md hover:bg-green-600 transition">Place Order</button>
        </form>
      </div>

      <div className="lg:w-[40%] w-full mt-8 lg:mt-0">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <table className="w-full mb-6 border text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Qty</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2 px-4 flex items-center gap-2">
                      <img
                        src={item.main_image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{item.title}</span>
                    </td>
                    <td className="py-2 px-4">${item.price}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>

            </table>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingCost}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
