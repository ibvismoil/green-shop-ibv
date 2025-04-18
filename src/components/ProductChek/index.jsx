import React, { useEffect, useState } from "react";
import { notification } from "antd"; 

const CheckoutForm = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
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
    setCartItems(items);

    const savedTotal = JSON.parse(localStorage.getItem("total")) || 0;
    setTotal(savedTotal);
  }, []);

  const handleQuantityChange = (id, delta) => {
    const updatedItems = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(updatedTotal);
    localStorage.setItem("total", JSON.stringify(updatedTotal));
  };

  const handleRemove = (id) => {
    const updatedItems = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(updatedTotal);
    localStorage.setItem("total", JSON.stringify(updatedTotal));
  };

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

    const orderData = {
      shop_list: cartItems.map((item) => ({
        product_id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      billing_address: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        town: formData.town,
        street_address: formData.street_address,
        additional_street_address: formData.additional_street_address,
        state: formData.state,
        zip: formData.zip,
        email: formData.email,
        phone_number: formData.phone_number,
      },
      extra_shop_info: {
        payment_method: formData.payment_method,
        order_notes: formData.order_notes,
      },
      total: total + shippingCost - discount, 
    };

    try {
      const response = await fetch(
        `https://green-shop-backend.onrender.com/api/order/make-order?access_token=${apikey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        notification.success({
          message: "Order Placed",
          description: "Your order has been placed successfully!",
        });

        localStorage.removeItem("cart");
        localStorage.removeItem("total");
        setCartItems([]);
        setTotal(0);
      } else {
        notification.error({
          message: "Order Failed",
          description: result.extraMessage || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error while placing the order:", error);
      notification.error({
        message: "Order Failed",
        description: "Error while placing the order. Please try again.",
      });
    }
  };

  return (
    <div className="mt-[30px] flex gap-9 max-md:flex-col">
      <div className="w-[60%] max-md:w-full">
        <h3 className="font-bold mb-[20px]">Billing Address</h3>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="first_name" className="block mb-1">
                First name
              </label>
              <input id="first_name" name="first_name" type="text" placeholder="Type your first name..." className="ant-input w-full px-2 py-2 border rounded-lg"
                required
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="last_name" className="block mb-1">
                Last name
              </label>
              <input id="last_name" name="last_name" type="text" placeholder="Type your last name..." className="ant-input w-full px-2 py-2 border rounded-lg"
                required
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="country" className="block mb-1">
                Country / Region
              </label>
              <input id="country" name="country"  type="text" placeholder="Select your country..." className="ant-input w-full  px-2 py-2 border rounded-lg"
                required
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="town" className="block mb-1">
                Town / City
              </label>
              <input  id="town" name="town" type="text" placeholder="Select your town..." className="ant-input w-full  px-2 py-2 border rounded-lg"
                required
                value={formData.town}
                onChange={handleChange}
              />
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="street_address" className="block mb-1">
                Street Address
              </label>
              <input id="street_address" name="street_address" type="text" placeholder="House number and street name" className="ant-input w-full  px-2 py-2 border rounded-lg"
                required
                value={formData.street_address}
                onChange={handleChange}
              />
            </div>
            <div className="w-[calc(50%-8px)]">
              <input id="additional_street_address" name="additional_street_address" type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="ant-input w-full  px-2 py-2 border rounded-lg mt-[24px]"
                value={formData.additional_street_address}
                onChange={handleChange}
              />
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="state" className="block mb-1">
                State
              </label>
              <input  id="state" name="state" type="text" placeholder="Select a state..." className="ant-input w-full  px-2 py-2 border rounded-lg" required value={formData.state} onChange={handleChange} />
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="zip" className="block mb-1">
                Zip
              </label>
              <input id="zip" name="zip" type="text" placeholder="ZIP code" className="ant-input w-full  px-2 py-2 border rounded-lg" required value={formData.zip} onChange={handleChange}/>
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="email" className="block mb-1">
                Email address
              </label>
              <input id="email" name="email" type="email" placeholder="Type your email..." className="ant-input w-full  px-2 py-2 border rounded-lg" required value={formData.email} onChange={handleChange}/>
            </div>
            <div className="w-[calc(50%-8px)]">
              <label htmlFor="phone_number" className="block mb-1">
                Phone Number
              </label>
              <div className="flex">
                <span className="ant-input-group-addon flex items-center px-2 border border-r-0 rounded-l">
                  +998
                </span>
                <input id="phone_number" name="phone_number" type="text" placeholder="Type your phone number..."  className="ant-input w-full  px-2 py-2 border rounded-lg rounded-l-none"
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
                  <input type="radio" name="payment_method" value="card" className="ant-radio-input mr-2"
                    defaultChecked
                    onChange={handleChange}
                  />
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Fimages%2Fpayment_collected_methods.png?alt=media&token=c4bfd991-8bd8-4e6b-97dc-83381db193f7"
                    alt="methods"
                  />
                </label>
                <label className="ant-radio-wrapper border border-[#46A358] w-full h-[40px] flex items-center pl-2 rounded-lg">
                  <input type="radio" name="payment_method" value="bank" className="ant-radio-input mr-2" onChange={handleChange}/>
                  Direct bank transfer
                </label>
                <label className="ant-radio-wrapper border border-[#46A358] w-full h-[40px] flex items-center pl-2 rounded-lg">
                  <input type="radio" name="payment_method" value="cod" className="ant-radio-input mr-2" onChange={handleChange}/>
                  Cash on delivery
                </label>
              </div>
            </div>
            <div className="w-full mt-4">
              <label htmlFor="order_notes" className="block mb-1">
                Order notes (optional)
              </label>
              <textarea id="order_notes" name="order_notes" rows="6" placeholder="Your order notes, thoughts, feedback, etc..." className="ant-input  px-2 py-2 border rounded-lg w-full" value={formData.order_notes} onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="bg-[#46A358] text-white mt-[40px] w-full h-[40px] rounded-md">
            Place Order
          </button>
        </form>
      </div>
      <div className="w-[35%]">
        <h3 className="font-bold mb-[20px]">Order Summary</h3>
        <div className="bg-[#F7F7F7] p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>{total} UZS</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>{shippingCost} UZS</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span>{discount}%</span>
            </div>
          )}
          <div className="flex justify-between font-bold mt-4">
            <span>Total to Pay</span>
            <span>
              {total + shippingCost - (total * discount) / 100} UZS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
