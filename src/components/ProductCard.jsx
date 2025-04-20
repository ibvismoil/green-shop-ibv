import { Heart, Search, ShoppingCart } from "lucide-react";
import { notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const accessToken = "68037186f2a99d02479565df";


export default function ProductCard({ data }) {
    if (!data) return;
    
    const {
        title: name,
        _id: id,
        main_image,
        price,
        discount_price,
        discount: isSale,
        category,
    } = data;
    
    const navigate = useNavigate();
    const getWishlist = () => JSON.parse(localStorage.getItem("wishlist")) || [];
    const initialWishlist = getWishlist();
    const isWished = initialWishlist.some(item => item.flower_id === id);
    const [liked, setLiked] = useState(isWished);

    const calculateDiscountPercent = (originalPrice, discountedPrice) => {
        const discounted = Number(discountedPrice);
        if (!originalPrice || !discounted || originalPrice <= discounted) return 0;
        return Math.round(((originalPrice - discounted) / originalPrice) * 100);
    };

    const discountPercent = calculateDiscountPercent(price, discount_price);

    const openNotification = (title, message, type = "success") => {
        notification[type]({
            message: title,
            description: message,
            placement: "topRight",
            duration: 2,
        });
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = cart.findIndex(item => item._id === id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...data, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        openNotification("Product Added to Cart", `${name} has been added to your cart successfully.`);
    };

    const handleToggleLike = async () => {
        if (!accessToken) {
            openNotification("Unauthorized", "You need to be logged in to use the wishlist.", "error");
            return;
        }

        const wishlist = getWishlist();

        try {
            if (liked) {
                const itemToDelete = wishlist.find(item => item.flower_id === id);

                if (!itemToDelete || !itemToDelete._id) {
                    openNotification("Error", "Wishlist item ID not found", "error");
                    return;
                }

                const res = await fetch(`https://green-shop-backend.onrender.com/api/user/delete-wishlist?access_token=${accessToken}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ _id: itemToDelete._id }),
                });

                const result = await res.json();

                if (!res.ok) {
                    openNotification("Error", result.extraMessage || "Failed to remove from wishlist", "error");
                    return;
                }

                const updated = wishlist.filter(item => item.flower_id !== id);
                localStorage.setItem("wishlist", JSON.stringify(updated));
                setLiked(false);
                openNotification("Removed from Wishlist", `${name} has been removed.`);
            } else {
                const res = await fetch(`https://green-shop-backend.onrender.com/api/user/create-wishlist?access_token=${accessToken}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        flower_id: id,
                        route_path: category || "default",
                        main_image,
                        discount_price,
                        title: name,
                    }),
                });

                const result = await res.json();

                if (!res.ok) {
                    openNotification("Error", result.extraMessage || "Failed to add to wishlist", "error");
                    return;
                }

                const newItem = {
                    _id: result._id || Date.now().toString(),
                    flower_id: id,
                    route_path: category || "default",
                    main_image,
                    discount_price,
                    title: name,
                };

                wishlist.push(newItem);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                setLiked(true);
                openNotification("Added to Wishlist", `${name} has been added to your wishlist.`);
            }
        } catch (error) {
            console.error("Wishlist Error:", error);
            openNotification("Error", "Something went wrong.", "error");
        }
    };
    const handleOpenDetail = () => {
        navigate(`/product/${category}/${id}`);
    };


    return (
        <div className="max-w-[300px] w-full border-t-2 border-t-transparent bg-gray-100 text-lg p-2 transi group rounded">
            <div className="card_img relative transi rounded overflow-hidden">
                <div className="bg-[#FBFBFB] transi w-full h-[275px] flex justify-center items-center">
                    <img
                        width={250}
                        height={250}
                        src={main_image}
                        alt={name}
                        className="w-full h-auto object-contain mix-blend-multiply scale-100"
                    />
                </div>
                <div className="flex justify-center items-center absolute w-full bottom-0 transi gap-0.5 group-hover:opacity-100 opacity-0 group-hover:gap-3 group-hover:bottom-2">
                    <button onClick={handleAddToCart} className="p-2 hover:bg-gray-300 transi bg-white rounded cursor-pointer">
                        <ShoppingCart size={19} />
                    </button>
                    <button onClick={handleToggleLike} className="p-2 hover:bg-gray-300 transi bg-white rounded cursor-pointer">
                        <Heart size={19} className={`transition-all ${liked ? "fill-[#46A358] text-[#46A358] scale-110" : "text-gray-500"}`} />
                    </button>
                    <button onClick={handleOpenDetail} className="p-2 hover:bg-gray-300 transi bg-white rounded cursor-pointer">
                        <Search size={19} />
                    </button>

                </div>
                {isSale && (
                    <div className="absolute opacity-100 rounded-br transi top-0 left-0 bg-[#46A358] text-white px-2 py-[2px] font-bold">
                        {discountPercent}% <span className="text-sm">OFF</span>
                    </div>
                )}
            </div>
            <div>
                <h4 className="font-bold mt-4 group-hover:text-[#46A358] transi">{name}</h4>
                {discountPercent !== 0 ? (
                    <p className="text-[#46A358] font-semibold">
                        ${Number(discount_price).toFixed(2)}{" "}
                        <span className="line-through text-gray-400 text-xs">${price.toFixed(2)}</span>
                    </p>
                ) : (
                    <p className="text-black font-semibold">${price.toFixed(2)}</p>
                )}
            </div>
        </div>
    );
}
