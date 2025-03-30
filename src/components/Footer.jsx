
"use client"
import { Facebook, Instagram, Linkedin, Mail, MailIcon, MapPin, PhoneCall, Twitter, Youtube } from "lucide-react"


export default function Footer() {
    return (
        <footer className="mt-[50px]">
            <div className="max-w-[1240px] m-auto bg-[#f5f5f5]">
                <div className="flex max-sm:flex-col">
                    <div className="m-[23px] pr-[23px] border-r border-[#46A358] max-sm:border-r-0 max-sm:border-b-2 pb-[23px]">
                        <div><img src="https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Ficons%2Ffooter_flower_1.svg?alt=media&token=407c8917-880e-4c1d-a8a8-b377ff7cc61c" alt="img" /></div>
                        <div>
                            <h3 className="font-bold text-base mt-[17px] mb-[9px]">Garden Care</h3>
                            <p className="font-light text-sm">We are an online plant shop offering a wide range of cheap and trendy plants.</p>
                        </div>
                    </div>
                    <div className="m-[23px] pr-[23px] border-r border-[#46A358] max-sm:border-r-0 max-sm:border-b-2 pb-[23px]]">
                        <div><img src="https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Ficons%2Ffooter_flower_2.svg?alt=media&token=cc49dd7d-b040-4311-a0a3-310c0aba964a" alt="img" /></div>
                        <div>
                            <h3 className="font-bold text-base mt-[17px] mb-[9px]">Plant Renovation</h3>
                            <p className="font-light text-sm">We are an online plant shop offering a wide range of cheap and trendy plants.</p>
                        </div>
                    </div>
                    <div className="m-[23px]">
                        <div><img src="https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Ficons%2Ffooter_flower_1.svg?alt=media&token=407c8917-880e-4c1d-a8a8-b377ff7cc61c" alt="img" /></div>
                        <div>
                            <h3 className="font-bold text-base mt-[17px] mb-[9px]">Watering Graden</h3>
                            <p className="font-light text-sm">We are an online plant shop offering a wide range of cheap and trendy plants.</p>
                        </div>
                    </div>
                    <div className="p-[23px]">
                        <h3 className="font-bold text-base mt-[17px] mb-[9px]">Would you like to join newsletters?</h3>
                        <div className="flex w-full h-[40px] mb-[17px]">
                            <input type="text" className="h-full w-4/5 rounded-s-xl pl-[11px] placeholder:font-light" placeholder="enter your email address..." />
                            <button className="bg-[#46A358] flex rounded-md items-center justify-center gap-1 text-base text-white h-full w-1/5 rounded-none rounded-e-xl">Join</button>
                        </div>
                        <p className="font-light leading-6 text-sm">We usually post offers and challenges in newsletter. We’re your online houseplant destination. We offer a wide range of houseplants and accessories shipped directly from our (green)house to yours! </p>
                    </div>
                </div>
                <div className="flex justify-between bg-[#46A3581A] p-[23px] max-lg:flex-col max-lg:items-center gap-2.5">
                    <div><img src="/images/logo.svg" alt="logog" /></div>
                    <div className="flex gap-2.5 items-center"><MapPin size={25} className="text-[#46A358] text-sm" /> 70 West Buckingham Ave. <br />  Farmingdale, NY 11735</div>
                    <div className="flex gap-2.5 items-center"><MailIcon size={20} className="text-[#46A358]" /> contact@greenshop.com</div>
                    <div className="flex gap-2.5 items-center"><PhoneCall size={20} className="text-[#46A358]" /> +88 01911 717 490</div>
                </div>
                <div className="flex justify-between p-[23px] max-sm:flex-col max-sm:gap-4">
                    <div className="flex flex-1 flex-col gap-2.5">
                        <h3 className="font-bold text-[18px]">My Account</h3>
                            <a href="/profile/account" className="hover:text-[green] text-sm font-inter font-[400] text-[15px]">My Account</a>
                            <a href="/profile/address" className="hover:text-[green] font-inter font-[400] text-[15px]">Address</a>
                            <a href="/profile/wishlist" className="hover:text-[green] font-inter font-[400] text-[15px]">Wishlist</a>
                    </div>
                    <div className="flex-1 flex flex-col gap-2.5">
                        <h3 className="font-bold text-[18px]">Categories</h3>
                        <a href="/?category=house-plants&sort=default-sorting&type=all-plants&range_min=0&range_max=2000" className="hover:text-[green] font-inter font-[400] text-[15px]">House Plants</a>
                        <a href="/?category=potter-plants&sort=default-sorting&type=all-plants&range_min=0&range_max=2000" className="hover:text-[green] font-inter font-[400] text-[15px]">Potter Plants</a>
                        <a href="/?category=seeds&sort=default-sorting&type=all-plants&range_min=0&range_max=2000" className="hover:text-[green] font-inter font-[400] text-[15px]">Seeds</a>
                        <a href="/?category=small-plants&sort=default-sorting&type=all-plants&range_min=0&range_max=2000" className="hover:text-[green] font-inter font-[400] text-[15px]">Small Plants</a>
                        <a href="/?category=accessories&sort=default-sorting&type=all-plants&range_min=0&range_max=2000" className="hover:text-[green] font-inter font-[400] text-[15px]">Accessories</a>
                    </div>
                    <div className="flex-1 ">
                        <div>
                            <h3 className="font-bold text-[16px]">Social Media</h3>
                            <div className="flex space-x-4 mt-[18px]">
                                <a href="https://www.facebook.com/"><Facebook   className="border text-[#46A358] border-[#46A35833] w-[30px] h-[30px] flex justify-center items-center cursor-pointer"/></a>
                                <a href="https://www.instagram.com/"><Instagram className="border text-[#46A358] border-[#46A35833] w-[30px] h-[30px] flex justify-center items-center cursor-pointer" /></a>
                                <a href="https://www.twitter.com"><Twitter className="border text-[#46A358] border-[#46A35833] w-[30px] h-[30px] flex justify-center items-center cursor-pointer" /></a>
                                <a href="https://www.linkedin.com/"><Linkedin className="border text-[#46A358] border-[#46A35833] w-[30px] h-[30px] flex justify-center items-center cursor-pointer" /></a>
                                <a href="https://mail.ru/"><Mail className="border text-[#46A358] border-[#46A35833] w-[30px] h-[30px] flex justify-center items-center cursor-pointer" /></a>
                            </div>
                        </div>
                        <div className="mt-[22px]">
                            <h4 className="font-bold text-[16px]">We accept</h4>
                            <div className="flex gap-[10px] mt-[18px]">
                                <img className="w-[30px] h-[30px]" src="/images/paypal.svg" alt="img" />
                                <img className="w-[30px] h-[30px]" src="/images/mastercard.svg" alt="img" />
                                <img className="w-[30px] h-[30px]" src="/images/visa.svg" alt="img" />
                                <img className="w-[30px] h-[30px]" src="/images/amex.svg" alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <p className="text-center p-[10px] font-normal text-sm">&copy; 2023 GreenShop. All Rights Reserved.</p>
        </footer>
    )
}

