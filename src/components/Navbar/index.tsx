"use client";

import { Modal, Badge } from "antd";
import { ShoppingCart, Heart, LogIn, Bell, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Auth from "../Auth";

interface UserType {
  user?: {
    name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function Navbar(): JSX.Element {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);

  const router = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLogged(!!parsedUser);
    } else {
      setUser(null);
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);


  return (
    <nav className="z-50 bg-white shadow-sm">
      <div className="flex justify-between border-green-600 items-center px-4 sm:px-6 lg:px-0 max-w-[1280px] mx-auto py-4">
        <Link to="/">
          <img src="/images/logo.svg" alt="logo" width={150} height={35} />
        </Link>

        <ul className="hidden md:flex gap-8 text-lg text-gray-700">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <ul className="flex gap-4">
            <li>
              <Link to="/product-card">
                <Badge count={cartCount} size="small" offset={[0, 4]}>
                  <ShoppingCart />
                </Badge>
              </Link>
            </li>
            <li><Bell /></li>
            <li><Link to="/profile/wishlist"><Heart /></Link></li>
          </ul>
          {isLogged ? (
            <button
              onClick={() => router("/profile/account")}
              className="bg-[#46A358] px-6 py-1.5 text-lg rounded text-white flex items-center gap-2"
            >
              {user?.user?.name || "User"}
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#46A358] text-base px-4 py-2 rounded-md text-white flex items-center gap-2"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 border-t text-base bg-white shadow-inner">
          <ul className="flex flex-col gap-3">
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link></li>
            <li><Link to="/product-card" onClick={() => setIsMobileMenuOpen(false)}>Cart ({cartCount})</Link></li>
            <li><Link to="/profile/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link></li>
          </ul>

          {isLogged ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                router("/profile/account");
              }}
              className="w-full bg-[#46A358] py-2 rounded text-white"
            >
              {user?.user?.name || "User"}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-[#46A358] py-2 rounded text-white"
            >
              <LogIn size={18} className="inline-block mr-2" /> Login
            </button>
          )}
        </div>
      )}

      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <div className="flex justify-center items-center gap-3 text-xl backdrop-blur-sm font-semibold my-4">
          {["Login", "Register"].map((text, i) => (
            <button
              key={text}
              onClick={() => setIsLoginOpen(i === 0)}
              className={isLoginOpen === (i === 0) ? "text-[#46A358]" : ""}
            >
              {text}
            </button>
          ))}
        </div>
        <Auth
          isLoginOpen={isLoginOpen}
          isRegisterOpen={!isLoginOpen}
          setIsModalOpen={setIsModalOpen}
          setIsLogged={setIsLogged}
        />
      </Modal>
    </nav>
  );
}
