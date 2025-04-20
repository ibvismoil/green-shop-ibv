import React, { useEffect, useState } from 'react';
import { List, Card, notification, Spin, Empty } from 'antd';
import { HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';

const accessToken = '68037186f2a99d02479565df';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://green-shop-backend.onrender.com/api/user/wishlist?access_token=${accessToken}`
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.extraMessage || 'Failed to get wishlist');
      }

      const items = Array.isArray(result.data)
        ? result.data.filter(item => item && item._id)
        : [];

      setWishlist(items);
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (itemId) => {
    const itemToDelete = wishlist.find(item => item && item._id === itemId);
    if (!itemToDelete) {
      notification.error({
        message: 'Error',
        description: 'Item to delete not found',
      });
      return;
    }

    try {
      const res = await fetch(
        `https://green-shop-backend.onrender.com/api/user/delete-wishlist?access_token=${accessToken}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: itemToDelete._id }),
        }
      );
      const result = await res.json();

      if (!res.ok) throw new Error(result.extraMessage || '!');

      const updated = wishlist.filter(item => item && item._id !== itemId);
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));

      notification.success({
        message: 'Removed',
        description: 'The product has been removed from the Wishlist.',
      });
    } catch (error) {
      notification.error({
        message: '!',
        description: error.message,
      });
    }
  };

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = cart.findIndex(prod => prod._id === item._id);

    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    notification.success({
      message: 'Аdded to cart.',
      description: `${item.title} added to cart.`,
    });
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-container px-6 py-10 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Wishlist</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : wishlist.length === 0 ? (
        <Empty description="Your Wishlist is empty." />
      ) : (
        <List grid={{ gutter: 32, column: 2, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }} dataSource={wishlist}
          renderItem={item => (
            <List.Item key={item._id}>
              <Card hoverable className="shadow-xl rounded-2xl transition-transform transform hover:-translate-y-1"
                cover={
                  <img alt={item.title} src={item.main_image} className="h-[300px] w-full object-cover rounded-t-2xl"/>
                }
                actions={[
                  <HeartFilled key="unlike" style={{ color: 'red', fontSize: 24 }} onClick={() => handleUnlike(item._id)}/>,
                  <ShoppingCartOutlined key="add-to-cart" style={{ fontSize: 22, color: '#46A358' }} onClick={() => handleAddToCart(item)}/>,
                ]}
              >
                <div className="px-3 py-2 text-base">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {item.discount && item.discount_price ? (
                      <>
                        <span className="text-[#46A358] font-semibold text-lg">
                          ${Number(item.discount_price).toFixed(2)}
                        </span>
                        <span className="line-through text-gray-400">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-semibold text-lg">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Категория: {item.category || 'не указана'}
                  </p>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
