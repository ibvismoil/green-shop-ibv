import { Slider } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import MainMapping from "../Categories";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";

const api = import.meta.env.VITE_API;
const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

const fetchCategories = async () => {
    const { data } = await axios.get(`${api}flower/category?access_token=${apikey}`);
    return data;
};

const fetchSaleBanner = async () => {
    const { data: ad } = await axios.get(`${api}features/discount?access_token=${apikey}`);
    return ad;
};

const CategoriesMain = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 2000]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const category = searchParams.get('category');
    const min = searchParams.has("range_min") ? Number(searchParams.get("range_min")) : 0;
    const max = searchParams.has("range_max") ? Number(searchParams.get("range_max")) : 2000;

    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });

    const { data: saleBanner } = useQuery({
        queryKey: ["saleBanner"],
        queryFn: fetchSaleBanner,
    });

    useEffect(() => {
        setPrice([min, max]);
    }, [min, max]);

    const updateSort = (category) => {
        const newParams = new URLSearchParams();
        if (category) {
            newParams.set("category", category);
        }
        setSearchParams(newParams);
        setSidebarOpen(false);
    };

    const handleFilterApply = () => {
        const newParams = new URLSearchParams(searchParams);
        if (price[0] !== 0) {
            newParams.set('range_min', price[0]);
        } else {
            newParams.delete('range_min');
        }
        if (price[1] !== 2000) {
            newParams.set('range_max', price[1]);
        } else {
            newParams.delete('range_max');
        }
        setSearchParams(newParams);
        setSidebarOpen(false);
    };

    return (
        <div className="max-w-[1240px] px-4 m-auto flex flex-col lg:flex-row justify-between items-start gap-6 mt-10 text-base">
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mb-4 px-4 py-2 bg-[#46A358] text-white font-semibold rounded flex items-center gap-2"
            >
                <SlidersHorizontal size={20} /> Filters
            </button>

            <div
                className={`w-full lg:w-[24%] bg-[#FBFBFB] pt-4 rounded-xl overflow-hidden z-10 lg:static fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="px-3">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-3 right-3 p-2 text-gray-500"
                    >
                        <X size={20} />
                    </button>

                    <h3 className="font-bold text-lg">Categories</h3>
                    {isLoading || error ? (
                        <ul>
                            {[...Array(9)].map((_, i) => (
                                <li key={i} className="transi w-[90%] m-auto h-[24px] my-3 loading"></li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="transi">
                            {data?.data.map(({ id, title, route_path, count }) => (
                                <li
                                    key={id || route_path || title}
                                    onClick={() => updateSort(route_path)}
                                    className={`cursor-pointer ${route_path === category ? "text-[#46A358] font-semibold" : "hover:text-[#46A358] font-normal"} pr-2 my-2 pl-4 text-lg transi flex justify-between items-center`}
                                >
                                    {title} <span>({count})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mt-4 px-3">
                    <h2 className="font-semibold mb-2 text-lg">Price Range</h2>
                    <div className="px-3">
                        <Slider range min={0} max={2000} step={1} value={price} trackStyle={[{ backgroundColor: "#46A358" }]} onChange={setPrice}/>
                    </div>
                    <p className="text-[#46A358] font-medium text-lg">
                        Price: ${price[0]} – ${price[1]}
                    </p>
                    <button onClick={handleFilterApply} className="cursor-pointer mt-2 px-4 py-2 font-semibold rounded-lg bg-[#46A358] text-lg text-white">
                        Filter
                    </button>
                </div>

                {saleBanner?.data?.poster_image_url && (
                    <div className="relative mt-[10px]">
                        <img src="/images/SuperSaleBanner.svg" alt="sale banner" className="w-full rounded h-auto mix-blend-multiply"/>
                        <p className="absolute top-[20%] w-full text-center font-semibold text-[23px] text-gray-600">
                            UP TO {saleBanner?.data?.discount_up_to}% OFF
                        </p>
                        <img src={saleBanner.data.poster_image_url} alt="discount ad" className="h-auto mix-blend-multiply absolute bottom-2 left-0"/>
                    </div>
                )}
            </div>
            <MainMapping currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
};

export default CategoriesMain;
