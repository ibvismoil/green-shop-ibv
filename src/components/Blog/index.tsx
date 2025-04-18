import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, Heart } from 'lucide-react';
import imgconect from '/images/image.png'

const api = import.meta.env.VITE_API;
const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

interface Blog {
  _id: string;
  title: string;
  short_description: string;
  image?: string;
  createdAt: string;
  views?: number;
  likes?: number;
  comments?: number;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = `${api}user/blog?access_token=${apikey}&search=`;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  
  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow animate-pulse"
          >
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-4" />
            <div className="flex justify-between mt-4">
              <div className="w-12 h-4 bg-gray-300 rounded" />
              <div className="w-12 h-4 bg-gray-300 rounded" />
              <div className="w-12 h-4 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );  
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="justify-between items-center mb-6">
        <div>
          {/* <div className='w-full h-[300px] p-[50px] bg-[#F5F5F5] mt-3 flex max-2xl:h-[200px] max-md:h-[150px] justify-between'> */}
          <div>
          <img src={imgconect} alt="" />
          </div>
          <h1 className='mt-[50px] font-black text-center text-[6vw]'>
          Monetize your content with <span className='text-[#46A358]'>GreenShop</span>
          </h1>
        <p className='text-center text-[25px] mt-[20px] max-xl:text-[2vw]'>Greenshop - a platform for buying and selling, publishing and monetizing all types of flowers: acrticles, notes, video, photos, podcasts or songs.</p>
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-400"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" 
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 line-clamp-4">{blog.short_description}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-500 border-t pt-3 mt-4">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                {blog.views || Math.floor(Math.random() * 500)}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                {blog.comments || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart size={16} />
                {blog.likes || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
