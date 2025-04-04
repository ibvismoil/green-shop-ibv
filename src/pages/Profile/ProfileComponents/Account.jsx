import React, { useState, useEffect } from 'react';

export default function Account() {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    
    const defaultUser = {
        _id: '',
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        username: '',
        profile_photo: '',
        billing_address: {}
    };

    const [user, setUser] = useState({ ...defaultUser, ...storedUser.user });
    const [photoSource, setPhotoSource] = useState('url'); 
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prev) => ({ ...prev, profile_photo: reader.result }));
            };
            reader.readAsDataURL(file); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ["_id", "name", "surname", "email", "phone_number", "username", "profile_photo"];
        for (let field of requiredFields) {
            if (!user[field]) {
                alert(`Поле ${field} обязательно!`);
                return;
            }
        }

        try {
            const response = await fetch("https://green-shop-backend.onrender.com/api/user/account-details?access_token=67dbc36eaf06d13e0cde0c21", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    phone_number: user.phone_number,
                    username: user.username,
                    profile_photo: user.profile_photo
                })
            });

            const data = await response.json();
            console.log("Ответ API:", data);

            setSuccessMessage('Changes saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            localStorage.setItem("user", JSON.stringify({ user }));

        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Personal Information</h2>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name *" value={user.name} onChange={(e) => handleInputChange(e, 'name')} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="Last Name *" value={user.surname} onChange={(e) => handleInputChange(e, 'surname')} className="border rounded p-2 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="email" placeholder="Email Address *" value={user.email} onChange={(e) => handleInputChange(e, 'email')} className="border rounded p-2 w-full" />
                    <input type="text" placeholder="Phone Number *" value={user.phone_number} onChange={(e) => handleInputChange(e, 'phone_number')} className="border rounded p-2 w-full" />
                </div>
                <div className="mt-4">
                    <input type="text" placeholder="Username *" value={user.username} onChange={(e) => handleInputChange(e, 'username')} className="border rounded p-2 w-full" />
                </div>

                <div className="mt-4">
                    <label>
                        <input type="radio" name="photoSource" value="url" checked={photoSource === 'url'} onChange={() => setPhotoSource('url')} />
                        Use Image URL
                    </label>
                    <label className="ml-4">
                        <input type="radio" name="photoSource" value="file" checked={photoSource === 'file'} onChange={() => setPhotoSource('file')} />
                        Upload from Device
                    </label>
                </div>

                {photoSource === 'url' ? (
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Profile Photo URL *"
                            value={user.profile_photo}
                            onChange={(e) => handleInputChange(e, 'profile_photo')}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                ) : (
                    <div className="mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                )}

                <button type="submit" className="mt-6 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded w-full">Save Changes</button>
            </form>
        </div>
    );
}
