import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Chrome, Eye, EyeOff, Facebook } from 'lucide-react';

const api = import.meta.env.VITE_API;
const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

function Login({ setIsModalOpen, setIsLogged }) {
  const [user, setUser] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSetValue = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleLoginCheck = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!user.email.trim()) newErrors.email = 'Please enter your email';
    if (!user.password.trim()) newErrors.password = 'Please enter your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${api}user/sign-in?access_token=${apikey}`, user);
      localStorage.setItem('user', JSON.stringify(response?.data?.data));
      localStorage.setItem('wishlist', JSON.stringify(response?.data?.data?.user?.wishlist));
      setUser({ email: '', password: '' });
      setIsLogged(true);
      setIsModalOpen(false);
      setErrors({});
      setIsLoading(false);
      toast.success(`You Successfully logged in as ${response?.data?.data?.user?.name}`);
      navigate('/');
    } catch (err) {
      setErrors({ apiError: err?.response?.data?.extraMessage || 'Login failed. ' });
      toast.error(`Failed on login, please make sure you have entered the correct email and password`);
    }
  };

  return (
    <div>
      <form onSubmit={handleLoginCheck} className='px-10'>
        <p className='font-medium text-gray-600 mb-4'>Enter your email and password to login.</p>

        <div className='relative mb-4'>
          <input 
            type='email' 
            className={`w-full border rounded p-2 outline-none ${errors.email ? 'border-red-500' : 'border-green-500'}`} 
            id='email' 
            name='email' 
            placeholder='Enter your email address' 
            value={user.email} 
            onChange={handleSetValue} 
          />
          {errors.email && <span className='text-red-500 text-xs'>{errors.email}</span>}
        </div>

        <div className='relative mb-4'>
          <input 
            type={showPassword ? 'text' : 'password'} 
            className={`w-full border rounded p-2 outline-none ${errors.password ? 'border-red-500' : 'border-green-500'}`} 
            id='password' 
            name='password' 
            placeholder='Enter your password' 
            value={user.password} 
            onChange={handleSetValue} 
          />
          <button 
            type='button' 
            className='absolute right-2 top-2 text-gray-600' 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <span className='text-red-500 text-xs'>{errors.password}</span>}
        </div>

        {errors.apiError && <p className='text-red-500 text-sm mt-2'>{errors.apiError}</p>}

        <button 
          type='submit' 
          className='w-full bg-[#46A358] text-lg font-semibold text-white rounded p-2 mt-3 hover:bg-[#3b8b4a] transition-all'
        >
          Login
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
    </div>
  );
}

export default Login;