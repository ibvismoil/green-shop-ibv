import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Chrome, Eye, EyeOff, Facebook } from 'lucide-react';

const api = import.meta.env.VITE_API;
const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

function Register({ setIsModalOpen, setIsLogged }) {
  const [user, setUser] = useState({ name: '', surname: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSetValue = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!user.name) newErrors.name = 'Enter your name';
    if (!user.surname) newErrors.surname = 'Enter your surname';
    if (!user.email) newErrors.email = 'Enter your email';
    if (user.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (user.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setIsLoading(true);
    try {
      const response = await axios.post(`${api}user/sign-up?access_token=${apikey}`, user);
      localStorage.setItem('user', JSON.stringify(response?.data?.data));
      setIsLogged(true);
      setIsModalOpen(false);
      toast.success(`${response?.data?.data?.user?.name} registered successfully!`);
      navigate('/');
    } catch (err) {
      setErrors({ apiError: err.response?.data?.extraMessage || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className='px-10'>
      <p className='font-medium'>Register with your email and password.</p>
      {['name', 'surname', 'email'].map((field) => (
        <div key={field} className='relative'>
          <input
            type='text'
            className={`w-full border rounded my-3 p-2 outline-none ${errors[field] ? 'border-red-500' : 'border-green-500'}`}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={user[field]}
            onChange={handleSetValue}
          />
          {errors[field] && <span className='absolute left-0 mt-14 text-red-500 text-xs'>{errors[field]}</span>}
        </div>
      ))}
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full border rounded my-3 p-2 outline-none ${errors.password ? 'border-red-500' : 'border-green-500'}`}
          name='password'
          placeholder='Create Password'
          value={user.password}
          onChange={handleSetValue}
        />
        <span className='absolute right-3 top-4 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
        {errors.password && <span className='absolute left-0 mt-14 text-red-500 text-xs'>{errors.password}</span>}
      </div>
      <div className='relative'>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          className={`w-full border rounded my-3 p-2 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-green-500'}`}
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className='absolute right-3 top-4 cursor-pointer' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
        {errors.confirmPassword && <span className='absolute left-0 mt-14 text-red-500 text-xs'>{errors.confirmPassword}</span>}
      </div>
      {errors.apiError && <p className='text-red-500 text-xs'>{errors.apiError}</p>}
      <button type='submit' className='w-full bg-[#46A358] text-lg font-semibold text-white rounded p-2 mt-5' disabled={isLoading}>
        Register
      </button>
      <div className='flex flex-col gap-3 mt-4'>
        <button className='flex items-center justify-center gap-2 w-full border border-gray-300 rounded p-2 text-gray-700 hover:bg-gray-100 transition-all'>
          <Chrome size={20} /> Login with Google
        </button>
        <button className='flex items-center justify-center gap-2 w-full border border-gray-300 rounded p-2 text-gray-700 hover:bg-gray-100 transition-all'>
          <Facebook size={20} /> Login with Facebook
        </button>
      </div>
    </form>
  );
}

export default Register;
