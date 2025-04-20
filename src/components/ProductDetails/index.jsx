import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Image, notification } from "antd";
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const accessToken = "68037186f2a99d02479565df";
const apiUrl = "https://green-shop-backend.onrender.com/api";

export default function ProductDetail() {
    const { id, category } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("M");
    const [previewImage, setPreviewImage] = useState("");
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (category && id) {
            fetch(`${apiUrl}/flower/category/${category}/${id}?access_token=${accessToken}`)
                .then(res => res.json())
                .then(data => {
                    setProduct(data.data);
                    setPreviewImage(data.data.main_image);
                    checkLiked(data.data._id);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Ошибка загрузки товара");
                    setLoading(false);
                });
        }
    }, [category, id]);

    const checkLiked = (flowerId) => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const isLiked = wishlist.some(item => item.flower_id === flowerId);
        setLiked(isLiked);
    };

    const handleToggleLike = async () => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (liked) {
            const itemToDelete = wishlist.find(item => item.flower_id === product._id);
            if (!itemToDelete || !itemToDelete._id) return;

            const res = await fetch(`${apiUrl}/user/delete-wishlist?access_token=${accessToken}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: itemToDelete._id }),
            });

            if (res.ok) {
                const updated = wishlist.filter(item => item.flower_id !== product._id);
                localStorage.setItem("wishlist", JSON.stringify(updated));
                setLiked(false);
                notification.success({ message: "Удалено из избранного" });
            }
        } else {
            const res = await fetch(`${apiUrl}/user/create-wishlist?access_token=${accessToken}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flower_id: product._id,
                    route_path: category || "default",
                    main_image: product.main_image,
                    discount_price: product.discount_price,
                    title: product.title,
                }),
            });

            const result = await res.json();
            if (res.ok) {
                const newItem = {
                    _id: result._id || Date.now().toString(),
                    flower_id: product._id,
                    route_path: category || "default",
                    main_image: product.main_image,
                    discount_price: product.discount_price,
                    title: product.title,
                };
                wishlist.push(newItem);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                setLiked(true);
                notification.success({ message: "Добавлено в избранное" });
            }
        }
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const index = cart.findIndex(item => item._id === product._id);

        if (index > -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        notification.success({ message: "Добавлено в корзину" });
    };

    if (loading) return <p className="p-10 text-xl">Загрузка...</p>;
    if (error) return <p className="p-10 text-xl text-red-500">{error}</p>;
    if (!product) return <p className="p-10 text-xl">Товар не найден</p>;

    const allImages = [product.main_image, ...(product.detailed_images || [])];

    const cleanedHTML = product.description
    .replace(/<p><br><\/p>/g, '') 
    .replace(/<\/em><\/p>\s*<p><em>/g, ' ')
    .replace(/<h3><strong>(\d+\.\s[\w\s]+)<\/strong><\/h3>/g, '<li><strong>$1</strong>') 
    .replace(/<p><em>/g, '<p>') 
    .replace(/<\/em>/g, '') 
    .replace(/<\/h3>/g, '</li>') 
    .replace(/<h2><strong>/g, '<h2>') 
    .replace(/<\/strong><\/h2>/g, '</h2>');

    return (
        <div>
            <div className="p-10 max-w-7xl mx-auto grid grid-cols-5 gap-10">
                <div className="flex flex-col gap-4 col-span-1">
                    <Image.PreviewGroup>
                        {allImages.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                alt={`Image ${index}`}
                                width={80}
                                height={80}
                                style={{
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: previewImage === img ? "2px solid #16a34a" : "1px solid #ccc",
                                    cursor: "pointer",
                                }}
                                preview={false}
                                onClick={() => setPreviewImage(img)}
                            />
                        ))}
                    </Image.PreviewGroup>
                </div>
                <div className="col-span-2 w-[400px] border-r rounded-sm flex items-center justify-center">
                    <Image
                        src={previewImage}
                        alt={product.title}
                        width={350}
                        style={{ border:"2px", objectFit: "contain" }}
                        preview={{ src: previewImage }}
                    />
                </div>

                <div className="col-span-2 flex flex-col justify-center gap-4">
                    <p className="text-green-600 text-xl font-semibold">
                        Price: ${product.discount_price || product.price}
                    </p>

                    <p className="text-gray-700">
                        <strong>Short Description:</strong><br />
                        {product.short_description || "—"}
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="text-lg font-medium">Size:</span>
                        {["S", "M", "L", "XL"].map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`border px-3 py-1 rounded-full ${size === s ? "bg-green-600 text-white" : ""
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xl">-</button>
                        <span className="text-xl">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xl">+</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold">BUY NOW</button>
                        <button
                            onClick={handleAddToCart}
                            className="border border-green-600 px-6 py-2 rounded-md font-semibold"
                        >
                            ADD TO CART
                        </button>
                        <button
                            onClick={handleToggleLike}
                            className="border border-green-600 p-2 rounded-md"
                        >
                            <Heart className={`${liked ? "fill-[#46A358] text-[#46A358]" : "text-gray-500"}`} />
                        </button>
                    </div>

                    <div className="text-sm text-gray-500 mt-4">
                        <p>SKU: {product._id}</p>
                        <p>Category: {product.category}</p>
                        <p>Tags: Home, Garden, Plants</p>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="cursor-pointer text-lg hover:text-[#46A358] text-[#46A358]">Product Description</h3>
                <hr className="my-4 bg-green-600 h-[2px] border-0" />
            <h3>{parse(DOMPurify.sanitize(cleanedHTML))}</h3>
            </div>
        </div>
    );
}
