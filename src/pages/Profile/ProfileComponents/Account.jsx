import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { notification } from 'antd';

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 400,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setUser((prev) => ({ ...prev, profile_photo: reader.result }));
          notification.success({ message: 'Фото успешно загружено!' });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Ошибка при сжатии изображения:", error);
        notification.error({ message: 'Ошибка при загрузке фото' });
      }
    }
  };

  const handleRemovePhoto = () => {
    setUser((prev) => ({ ...prev, profile_photo: '' }));
    notification.info({ message: 'Фото удалено' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["_id", "name", "surname", "email", "phone_number", "username"];
    for (let field of requiredFields) {
      if (!user[field]) {
        notification.warning({ message: `Поле "${field}" обязательно!` });
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

      localStorage.setItem("user", JSON.stringify({ user }));
      notification.success({ message: 'Your account details has been updated!' });

    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      notification.error({ message: 'Ошибка при сохранении данных' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-between items-center">
          <label className='w-full my-3'>
            <div className='font-semibold text-sm'><span className='text-red-500'>*</span> First Name</div>
            <input type="text" value={user.name} onChange={(e) => handleInputChange(e, 'name')} className='w-full my-2 py-2 px-3 rounded-lg border bg-white' />
          </label>
          <label className='w-full my-3'>
            <div className='font-semibold text-sm'><span className='text-red-500'>*</span> Last Name</div>
            <input type="text" value={user.surname} onChange={(e) => handleInputChange(e, 'surname')} className='w-full my-2 py-2 px-3 rounded-lg border bg-white' />
          </label>
        </div>

        <div className='flex gap-3 justify-between items-center'>
          <label className='w-full my-3'>
            <div className='font-semibold text-sm'><span className='text-red-500'>*</span> Email Address</div>
            <input type="email" value={user.email} onChange={(e) => handleInputChange(e, 'email')} className='w-full my-2 py-2 px-3 rounded-lg border bg-white' />
          </label>
          <label className='w-full my-3'>
            <div className='font-semibold text-sm'><span className='text-red-500'>*</span> Phone</div>
            <div className='w-full my-2 flex items-center rounded-lg border bg-white'>
              <div className='bg-[#FBFBFB] py-2 px-3 border-r-2 font-semibold'>+998</div>
              <input type="number" value={user.phone_number} onChange={(e) => handleInputChange(e, 'phone_number')} className='w-full outline-none rounded-r-lg py-2 px-3 bg-white' />
            </div>
          </label>
        </div>

        <div className='flex gap-3 justify-between items-center'>
          <label className='w-full my-3'>
            <div className='font-semibold text-sm'><span className='text-red-500'>*</span> Username</div>
            <input type="text" value={user.username} onChange={(e) => handleInputChange(e, 'username')} className="border rounded p-2 w-full" />
          </label>
        </div>

        <div className="mt-4">
          <input type="file" accept="image/*" onChange={handleFileChange} className="border rounded p-2 w-full" />
        </div>

        {user.profile_photo && (
          <div className="mt-4 flex flex-col items-center">
            <img src={user.profile_photo} alt="Profile" className="w-24 h-24 object-cover rounded-full mb-2 border" />
            <button type="button" onClick={handleRemovePhoto} className="text-sm text-red-500 hover:underline">
              Remove Photo
            </button>
          </div>
        )}

        <button type="submit" className="mt-6 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
