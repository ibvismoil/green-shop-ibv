 
"use client"
import {Facebook, Instagram, Linkedin, Mail, MailIcon, MapPin, PhoneCall, Twitter, Youtube} from "lucide-react"


export default function Footer() {
    return (
        <footer className="mt-[100px]">
            <div className="max-w-[1240px] m-auto bg-[#FBFBFB]">
                <div className="flex justify-between items-start pb-5 pt-7 px-4">
                    <div className="w-[23%] px-5 border-r-2 border-r-[#46A3581A]">
                        <div><img src="/images/f11.svg" alt="img" /></div>
                        <div>
                            <h3 className="font-bold text-lg mt-4 mb-1">Garden Care</h3>
                            <p className="text-sm text-gray-400">We are an online plant shop offering a wide range of cheap and trendy plants.</p>
                        </div>
                    </div>
                    <div className="w-[23%] px-5 border-r-2 border-r-[#46A3581A]">
                        <div><img src="/images/f22.svg" alt="img" /></div>
                        <div>
                            <h3 className="font-bold text-lg mt-4 mb-1">Plant Renovation</h3>
                            <p className="text-sm text-gray-400">We are an online plant shop offering a wide range of cheap and trendy plants.</p>
                        </div>
                    </div>
                    <div className="w-[23%] px-5 ">
                        <div><img src="/images/f33.svg" alt="img" /></div>
                        <div>
                            <h3 className="font-bold text-lg mt-4 mb-1">Watering Graden</h3>
                            <p className="text-sm text-gray-400">We are an online plant shop offering a wide range of cheap and trendy plants.</p>
                        </div>
                    </div>
                    <div className="w-[31%]">
                        <h3 className="font-bold text-lg">Would you like to join newsletters?</h3>
                        <div className="flex items-center mt-3 mb-7">
                            <input type="text" className="bg-white py-2 px-4 w-full rounded-l shadow" placeholder="enter your email address..." />
                            <button className="py-2 px-5 rounded-r text-white font-semibold bg-[#46A358]">Join</button>
                        </div>
                            <p className="text-sm text-gray-400">We usually post offers and challenges in newsletter. We’re your online houseplant destination. We offer a wide range of houseplants and accessories shipped directly from our (green)house to yours! </p>
                    </div>
                </div>
                <div className="bg-[#46A3581A] flex justify-between items-center p-5 pl-8">
                    <div><img src="/images/logo.svg" alt="logog" /></div>
                    <div className="max-w-[250px] flex gap-2 items-center text-sm text-[#3D3D3D]"><MapPin size={25} className="text-[#46A358]"/> 70 West Buckingham Ave. Farmingdale, NY 11735</div>
                    <div className="max-w-[200px] flex gap-2 items-center text-sm text-[#3D3D3D]"><MailIcon size={20} className="text-[#46A358]"/> contact@greenshop.com</div>
                    <div className="max-w-[400px] w-full flex gap-2 items-center text-sm text-[#3D3D3D]"><PhoneCall size={20} className="text-[#46A358]"/> +88 01911 717 490</div>
                </div>
                <div className="max-w-7xl mt-[10px] mx-auto px-4 grid grid-cols-4 gap-6 bg-[#FBFBFB] block">
                    <div>
                        <h4 className="font-bold mb-2">My Account</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li><a href="/profile" className="hover:text-green-600">My Account</a></li>
                            <li><a href="#" className="hover:text-green-600">Address</a></li>
                            <li><a href="#" className="hover:text-green-600">Wishlist</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Categories</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li><a href="#" className="hover:text-green-600">House Plants</a></li>
                            <li><a href="#" className="hover:text-green-600">Potter Plants</a></li>
                            <li><a href="#" className="hover:text-green-600">Seeds</a></li>
                            <li><a href="#" className="hover:text-green-600">Small Plants</a></li>
                            <li><a href="#" className="hover:text-green-600">Accessories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Social Media</h4>
                        <div className="flex space-x-2">
                            <a href="#" className=" text-green-500 rounded"><Facebook /></a>
                            <a href="#" className=" text-green-500 rounded"><Instagram /></a>
                            <a href="#" className=" text-green-500 rounded"><Twitter /></a>
                            <a href="#" className=" text-green-500 rounded"><Linkedin /></a>
                            <a href="#" className=" text-green-500 rounded"><Youtube /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">We accept</h4>
                        <div className="flex space-x-2">
                            <span className="bg-gray-300 p-2 rounded">PayPal</span>
                            <span className="bg-gray-300 p-2 rounded">Mastercard</span>
                            <span className="bg-gray-300 p-2 rounded">Visa</span>
                            <span className="bg-gray-300 p-2 rounded">Amex</span>
                        </div>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">&copy; 2021 GreenShop. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

