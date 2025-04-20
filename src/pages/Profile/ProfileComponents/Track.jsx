import React, { useEffect, useState } from 'react';
import { Table, Button, Spin, Empty, Modal, Descriptions, List, Popconfirm, notification, } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const api = import.meta.env.VITE_API;
  const token = import.meta.env.VITE_PUBLIC_ACCESS_TOKEN;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${api}order/get-order?access_token=${token}`);
        const { data, extraMessage } = await res.json();
        if (!res.ok) throw new Error(extraMessage);
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        notification.error({ message: 'Ошибка', description: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(
        `${api}order/delete-order?access_token=${token}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id }),
        }
      );
      const { extraMessage } = await res.json();
      if (!res.ok) throw new Error(extraMessage);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      notification.success({ message: 'Deleted', description: 'The order has been deleted.' });
      closeModal();
    } catch (e) {
      notification.error({ message: 'Uninstall error.', description: e.message });
    }
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: '_id',
      render: (id) => <span className="font-medium">{id.slice(-12)}</span>,
      className: 'whitespace-nowrap',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: 'Total',
      dataIndex: ['extra_shop_info', 'totalPrice'],
      render: (sum) => <span className="text-green-600 font-semibold">${sum}</span>,
    },
    {
      title: 'More',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" className="text-green-500 hover:text-green-800" onClick={() => openDetails(record)}>
          Get details
        </Button>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : orders.length === 0 ? (
        <Empty description="No orders" />
      ) : (
        <Table dataSource={orders} columns={columns} rowKey="_id" pagination={false} className="shadow-lg rounded-lg overflow-hidden" rowClassName={() => 'hover:bg-gray-50'}/>
      )}
      <Modal
        open={modalVisible}
        title="Detailed Order"
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancel
          </Button>,
          <Popconfirm
            key="del"
            title="Should I delete this order?"
            onConfirm={() => deleteOrder(selectedOrder._id)}
            okText="Yes"
            cancelText="Cansel"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>,
        ]}
        width={700}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={2} size="middle" labelStyle={{ width: 150 }} contentStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="Order Number">
                {selectedOrder._id}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {Date(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                ${selectedOrder.extra_shop_info.totalPrice}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrder.extra_shop_info.payment_method || '—'}
              </Descriptions.Item>
            </Descriptions>

            <div className="flex justify-end mt-4 space-x-8 text-gray-700">
              <div>
                <span className="font-medium">Shipping:</span>{' '}
                <span className="text-green-600">
                  ${selectedOrder.shipping_price ?? 0}
                </span>
              </div>
              <div>
                <span className="font-medium">Total:</span>{' '}
                <span className="text-green-600 font-semibold">
                  ${selectedOrder.extra_shop_info.totalPrice}
                </span>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
