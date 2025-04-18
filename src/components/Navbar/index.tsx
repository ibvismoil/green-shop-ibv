"use client";

import { Modal, Badge } from "antd";
import { ShoppingCart, Heart, LogIn } from "lucide-react";
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
      console.log("🔄 cartUpdated event caught:", cart);
      setCartCount(cart.length);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <nav className="z-50 bg-white">
      <div className="flex justify-between w-[1200px] items-center mx-auto py-5">
        <Link to="/">
          <img src="/images/logo.svg" alt="logo" width={150} height={35} />
        </Link>
        <ul className="flex gap-8 font-size-[24px] text-lg text-gray-700">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <ul className="flex gap-4">
            <li>
              <Link to="/product-card">
                <Badge count={cartCount} size="small" offset={[0, 4]}>
                  <ShoppingCart />
                </Badge>
              </Link>
            </li>
            <li>
              <Link to="/profile/wishlist"><Heart /></Link>
            </li>
          </ul>
          {isLogged ? (
            <button
              onClick={() => router("/profile/account")}
              className="bg-[#46A358] hover:bg-[#46A358] px-6 py-1.5 text-lg rounded text-white flex items-center gap-2"
            >
              {user?.user?.name || "User"}
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#46A358] font-semibold hover:bg-[#46A358] text-base px-4 py-2 rounded-md text-white flex items-center gap-2"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>
      </div>
      <hr className="max-w-[1280px] mx-auto bg-[#46A35880] border-none h-[1px]" />
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
