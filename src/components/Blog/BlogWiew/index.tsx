import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Eye } from 'lucide-react';

const api = import.meta.env.VITE_API;
const apikey = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${api}user/blog/${id}?access_token=${apikey}`);
        const data = await res.json();
        setBlog(data.data);
  
        if (data.data?.created_by) {
          const authorRes = await fetch(`${api}user/by_id/${data.data.created_by}?access_token=${apikey}`);
          const authorData = await authorRes.json();
          setAuthor(authorData.data);
        }

        await fetch(`${api}user/blog/view?access_token=${apikey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ blog_id: id })
        });
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки');
      }
    };
  
    fetchBlog();
  }, [id]);
  

  if (error) return <p className="text-red-500">{error}</p>;
  if (!blog) return <p className="text-gray-500">Загрузка...</p>;

  const createdDate = new Date(blog.createdAt).toLocaleDateString();

  const cleanedHTML = blog.content
    .replace(/<p><br><\/p>/g, '') 
    .replace(/<\/em><\/p>\s*<p><em>/g, ' ')
    .replace(/<h3><strong>(\d+\.\s[\w\s]+)<\/strong><\/h3>/g, '<li><strong>$1</strong>') 
    .replace(/<p><em>/g, '<p>') 
    .replace(/<\/em>/g, '') 
    .replace(/<\/h3>/g, '</li>') 
    .replace(/<h2><strong>/g, '<h2>') 
    .replace(/<\/strong><\/h2>/g, '</h2>');

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <div className="flex items-center mb-6">
        {author?.profile_photo && (
          <img
            src={author.profile_photo}
            alt={author?.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <p className="font-semibold">{author?.name} {author?.surname}</p>
          <p className="text-sm text-gray-500">Followers: {author?.followers?.length || 0}</p>
        </div>
        <button className="ml-auto px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          Follow
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full mb-8 rounded"
        />
      )}

        {blog.short_description && (
          <p className="text-lg mb-6 whitespace-pre-line">{blog.short_description}</p>
        )}

      <div className="prose prose-lg max-w-none">
        <ol className="list-inside text-lg whitespace-pre-line">
          {parse(DOMPurify.sanitize(cleanedHTML))}
        </ol>
      </div>
      <div>
        <p className="text-sm flex mt-4 gap-2 aligin-center text-gray-500 mb-4">
          <Eye size={20} /> {blog.views || 0}
        </p></div>
    </div>
  );
}
