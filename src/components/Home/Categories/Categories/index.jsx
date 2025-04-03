import ProductCard from "../../../ProductCard";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const api = import.meta.env.VITE_API;
const userData = JSON.parse(localStorage.getItem("user") || "{}");
const accessToken = userData?.user?._id || "64bebc1e2c6d3f056a8c85b7";

const fetchFlowers = async ({ queryKey }) => {
  const [_key, category, sort, filter, min, max] = queryKey;

  const url = new URL(`${api}flower/category/${category}`);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("sort", sort);
  url.searchParams.set("type", filter);
  url.searchParams.set("range_min", min);
  url.searchParams.set("range_max", max);

  const response = await fetch(url);
  const data = await response.json();
  return data?.data || [];
};

export default function ({ currentPage, setCurrentPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSortOrder] = useState(searchParams.get("sort") || "default-sorting");
  const [selectedFilter, setSelectedFilter] = useState(searchParams.get("type") || "all-plants");
  const topRef = useRef(null);
  const onePage = 9;
  const category = searchParams.get("category") || "house-plants";
  const min = searchParams.get("range_min") || "0";
  const max = searchParams.get("range_max") || "2000";

  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("category", category);
    newParams.set("sort", sort);
    newParams.set("type", selectedFilter);
    newParams.set("range_min", min);
    newParams.set("range_max", max);
    setSearchParams(newParams);
  }, [category, sort, selectedFilter, min, max, setSearchParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { data: productsData = [], error, isLoading, isFetching } = useQuery({
    queryKey: ["flower", category, sort, selectedFilter, min, max],
    queryFn: fetchFlowers,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const totalPages = Math.max(1, Math.ceil(productsData.length / onePage));
  const paginatedProducts = productsData.slice((currentPage - 1) * onePage, currentPage * onePage);

  return (
    <div className="w-[76%] lg:pl-5 pt-0 max-lg:w-full">
      <div ref={topRef} className="flex justify-between items-center mb-10">
        <ul className="flex justify-start items-center gap-5 font-semibold">
          {["all-plants", "new-arrivals", "sale"].map((value) => (
            <li key={value}
                className={`cursor-pointer border-b ${selectedFilter === value ? "text-[#46A358] border-b-[#46A358]" : "hover:text-[#46A358] border-b-transparent"}`}
                onClick={() => setSelectedFilter(value)}>
              {value.replace("-", " ")}
            </li>
          ))}
        </ul>
        <div className="flex max-md:hidden justify-end gap-3 items-center font-semibold">
          <p>
            Sorting:
            <select name="sort" className="outline-none font-normal" value={sort} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default-sorting">Default Sorting</option>
              <option value="the-cheapest">The Cheapest</option>
              <option value="most-expensive">Most Expensive</option>
            </select>
          </p>
        </div>
        <button className="md:hidden"><SlidersHorizontal /></button>
      </div>

      {isLoading || isFetching ? (
        <p className="text-center">Loading...</p>
      ) : paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 justify-items-center gap-5">
            {paginatedProducts.map((product, index) => (
              <ProductCard key={index} data={product} />
            ))}
          </div>
          <div className="flex justify-center sm:justify-end items-center gap-2 mt-5">
            <button className="p-2 bg-gray-200 rounded disabled:opacity-40"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}>
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-[#46A358] text-white" : "bg-gray-200"}`}>
                {i + 1}
              </button>
            ))}
            <button className="p-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}>
              <ChevronRight />
            </button>
          </div>
        </>
      ) : (
        <div className="text-3xl text-center mt-10">No products available</div>
      )}
    </div>
  );
}
