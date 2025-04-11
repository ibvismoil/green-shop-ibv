import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Chrome, Eye, EyeOff, Facebook } from 'lucide-react';
import { signInWithGoogle } from '../../../../firebase';

const api = import.meta.env.VITE_API;
const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

interface User {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  apiError?: string;
}

interface LoginProps {
  setIsModalOpen: (value: boolean) => void;
  setIsLogged: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsModalOpen, setIsLogged }) => {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSetValue = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleLoginCheck = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    let newErrors: Errors = {};

    if (!user.email.trim()) newErrors.email = 'Please enter your email';
    if (!user.password.trim()) newErrors.password = 'Please enter your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${api}user/sign-in?access_token=${apikey}`, user);
      if (response?.data?.data) {
        localStorage.setItem('user', JSON.stringify(response?.data?.data));
        localStorage.setItem('wishlist', JSON.stringify(response?.data?.data?.user?.wishlist));
        setUser({ email: '', password: '' });
        setIsLogged(true);
        setIsModalOpen(false);
        setErrors({});
        setIsLoading(false);
        toast.success(`You Successfully logged in as ${response?.data?.data?.user?.name}`);
        navigate('/');
      } else {
        setErrors({ apiError: 'Login failed, please check your credentials' });
        toast.error('Login failed, please check your credentials');
      }
    } catch (err: any) {
      if (err?.response?.data?.extraMessage) {
        setErrors({ apiError: err?.response?.data?.extraMessage });
        toast.error(err?.response?.data?.extraMessage || 'Login failed. Please try again.');
      } else {
        setErrors({ apiError: 'Login failed. Please try again.' });
        toast.error('Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const SignInWithGoogleFl = async (): Promise<void> => {
    try {
      const result = await signInWithGoogle();
      if (result?.user?.email) {
        const userData = {
          email: result.user.email,
          name: result.user.displayName || 'No name',
          surname: result.user.displayName || 'No surname',
          password: 'random_password',
        };

        const response = await axios.post(`${api}user/sign-in?access_token=${apikey}`, userData);

        if (response?.data?.data) {
          localStorage.setItem('user', JSON.stringify(response?.data?.data));
          localStorage.setItem('wishlist', JSON.stringify(response?.data?.data?.user?.wishlist));
          setUser({ email: '', password: '' });
          setIsLogged(true);
          setIsModalOpen(false);
          setErrors({});
          toast.success(`You Successfully logged in as ${response?.data?.data?.user?.name}`);
          navigate('/');
        } else {
          setErrors({ apiError: 'Google Sign-In failed, please try again.' });
          toast.error('Google Sign-In failed, please try again.');
        }
      } else {
        setErrors({ apiError: 'Google Sign-In failed, email not available' });
        toast.error('Google Sign-In failed, email not available');
      }
    } catch (err: any) {
      setErrors({ apiError: err?.response?.data?.extraMessage || 'Google Sign-In failed.' });
      toast.error('Google Sign-In failed. Please make sure you have entered the correct email and password');
    }
  };

  return (
    <div>
      <form onSubmit={handleLoginCheck} className="px-10">
        <p className="font-medium text-gray-600 mb-4">Enter your email and password to login.</p>

        <div className="relative mb-4">
          <input
            type="email"
            className={`w-full border rounded p-2 outline-none ${errors.email ? 'border-red-500' : 'border-green-500'}`}
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={user.email}
            onChange={handleSetValue}
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
        </div>

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`w-full border rounded p-2 outline-none ${errors.password ? 'border-red-500' : 'border-green-500'}`}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleSetValue}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
        </div>

        {errors.apiError && <p className="text-red-500 text-sm mt-2">{errors.apiError}</p>}

        <button
          type="submit"
          className="w-full bg-[#46A358] text-lg font-semibold text-white rounded p-2 mt-3 hover:bg-[#3b8b4a] transition-all"
          disabled={isLoading}
        >
          Login
        </button>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={SignInWithGoogleFl}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded p-2 text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Chrome size={20} /> Login with Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded p-2 text-gray-700 hover:bg-gray-100 transition-all">
            <Facebook size={20} /> Login with Facebook
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
