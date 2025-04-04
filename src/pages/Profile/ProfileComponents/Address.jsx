import React, { useState, useEffect } from 'react';

export default function Address() {
    const storedUser = JSON.parse(localStorage.getItem("user")) || { user: { billing_address: {} } };
    const [user, setUser] = useState(storedUser.user);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify({ user }));
    }, [user]);

    const handleInputChange = (e, field, isBilling = false) => {
        const value = e.target.value;
        setUser((prev) =>
            isBilling
                ? { ...prev, billing_address: { ...prev.billing_address, [field]: value } }
                : { ...prev, [field]: value }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.setItem("user", JSON.stringify({ user }));

        const requiredFields = ["country", "town", "street_address", "state", "zip", "phone_number", "name", "surname", "email"];

        for (let field of requiredFields) {
            if (!user.billing_address?.[field] && !user[field]) {
                alert(`Поле ${field} обязательно!`);
                return;
            }
        }

        try {
            const response = await fetch("https://green-shop-backend.onrender.com/api/user/address?access_token=67dbc36eaf06d13e0cde0c21", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    country: user.billing_address?.country,
                    town: user.billing_address?.town,
                    street_address: user.billing_address?.street_address,
                    state: user.billing_address?.state,
                    zip: user.billing_address?.zip,
                    phone_number: user.phone_number
                })
            });

            const data = await response.json();
            console.log("Ответ API:", data);

            setSuccessMessage('The address has been saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Billing Address</h2>
            <p className="text-sm text-gray-600 mb-4">The following addresses will be used on the checkout page by default.</p>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded transition-all duration-300">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name *" value={user.name || ''} onChange={(e) => handleInputChange(e, 'name')} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="Last Name *" value={user.surname || ''} onChange={(e) => handleInputChange(e, 'surname')} className="border rounded p-2 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" placeholder="Country / Region *" value={user.billing_address?.country || ''} onChange={(e) => handleInputChange(e, 'country', true)} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="Town / City *" value={user.billing_address?.town || ''} onChange={(e) => handleInputChange(e, 'town', true)} className="border rounded p-2 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" placeholder="Street Address *" value={user.billing_address?.street_address || ''} onChange={(e) => handleInputChange(e, 'street_address', true)} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="Extra Address (optional)" value={user.billing_address?.extra_address || ''} onChange={(e) => handleInputChange(e, 'extra_address', true)} className="border rounded p-2 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" placeholder="State *" value={user.billing_address?.state || ''} onChange={(e) => handleInputChange(e, 'state', true)} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="ZIP *" value={user.billing_address?.zip || ''} onChange={(e) => handleInputChange(e, 'zip', true)} className="border rounded p-2 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="email" placeholder="Email Address *" value={user.email || ''} onChange={(e) => handleInputChange(e, 'email')} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="Phone Number *" value={user.phone_number || ''} onChange={(e) => handleInputChange(e, 'phone_number')} className="border rounded p-2 w-full" />
                </div>
                <button type="submit" className="mt-6 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded w-full">Save Address</button>
            </form>
        </div>
    );
}
