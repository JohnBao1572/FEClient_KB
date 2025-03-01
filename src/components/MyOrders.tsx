import handleAPI from '@/apis/handleAPI';
import { AddressModel, BillModel, BillStatus, PaymentStatus } from '@/models/Product';
import { FormatCurrency } from '@/utils/formatNumber';
import { Alert, Button, List, message, Modal, Spin, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MyOrders = () => {
    const [orders, setOrders] = useState<BillModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<BillModel | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addresses, setAddresses] = useState<Record<string, any>>({});
    const [products, setProducts] = useState<Record<string, any>>({});

    // Fetch Orders, Addresses & Products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, addressesRes, productsRes] = await Promise.all([
                    handleAPI({ url: '/payments/', method: 'get' }),
                    handleAPI({ url: '/carts/get-address', method: 'get' }),
                    handleAPI({ url: '/products/', method: 'get' }),
                ]);

                // Xử lý đơn hàng
                if (Array.isArray(ordersRes?.data?.data)) {
                    setOrders(ordersRes.data.data);
                } else {
                    setOrders([]);
                }

                // Xử lý địa chỉ
                if (Array.isArray(addressesRes?.data?.data)) {
                    const addressMap = addressesRes.data.data.reduce((acc: Record<string, any>, addr: any) => {
                        acc[addr._id] = addr;
                        return acc;
                    }, {});
                    setAddresses(addressMap);
                }

                // Xử lý sản phẩm
                if (Array.isArray(productsRes?.data?.data)) {
                    const productMap = productsRes.data.data.reduce((acc: Record<string, any>, prod: any) => {
                        acc[prod._id] = prod;
                        return acc;
                    }, {});
                    setProducts(productMap);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteOrder = async (orderId: string) => {
        if (!orderId) {
            message.error("Error: ID order not valid!");
            return;
        }

        try {
            setLoading(true);

            // Gửi yêu cầu xóa đơn hàng
            const deleteRes = await handleAPI({
                url: `/payments/delete-bill?id=${orderId}`,
                method: 'delete',
            });

            if (deleteRes?.data?.success) {
                message.success("Delete order success");

                // Fetch lại danh sách đơn hàng mới nhất
                const updatedOrdersRes = await handleAPI({
                    url: '/payments/',
                    method: 'get',
                });

                if (Array.isArray(updatedOrdersRes?.data?.data)) {
                    setOrders(updatedOrdersRes.data.data);
                } else {
                    setOrders([]);
                }
            } else {
                message.error("Delete my order failed");
            }
        } catch (error) {
            console.error("Error when delete order", error);
            message.error("Have an error when delete order");
        } finally {
            setLoading(false);
        }
    };

    // Trạng thái đơn hàng
    const getOrderStatusTag = (status: BillStatus) => {
        const statusMap = {
            [BillStatus.PENDING]: { text: 'Pending', color: 'blue' },
            [BillStatus.IN_PROCESS]: { text: 'In Process', color: 'orange' },
            [BillStatus.DELIVERED]: { text: 'Delivered', color: 'green' },
            [BillStatus.CANCELED]: { text: 'Canceled', color: 'red' },
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
    };

    // Trạng thái thanh toán
    const getPaymentStatusTag = (status: PaymentStatus) => {
        return status === PaymentStatus.PAID ? (
            <Tag color="green">Paid</Tag>
        ) : (
            <Tag color="red">Unpaid</Tag>
        );
    };

    // Mở modal xem chi tiết đơn hàng
    const showModal = (order: BillModel) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    // Cấu hình bảng
    const columns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            render: (_id: string) => <strong>{_id}</strong>,
        },

        {
            title: 'Customer',
            dataIndex: 'shippingAddress',
            key: 'name',
            render: (shippingAddress: AddressModel) =>
                addresses[shippingAddress?.address]?.name || <em>Unknown</em>,
        },

        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: (productList: { _id: string; title: string }[]) => (
                productList?.length
                    ? productList.map((prod) => <p key={prod._id} style={{ margin: 0 }}>{prod.title}</p>)
                    : <strong>No products</strong>
            ),
        },

        { title: 'Status', dataIndex: 'status', key: 'status', render: getOrderStatusTag },

        { title: 'Payment', dataIndex: 'paymentStatus', key: 'paymentStatus', render: getPaymentStatusTag },

        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => <strong>{FormatCurrency.VND.format(total)}</strong>,
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: BillModel) => (
                <>
                    <Button
                        onClick={() => showModal(record)}
                        icon={<EyeOutlined size={20} color='blue' />}
                        type='text'
                    />

                    <Button
                        onClick={() =>
                            Modal.confirm({
                                title: 'Confirm',
                                content: 'Are you sure you want to remove this order?',
                                onOk: async () => handleDeleteOrder(record._id),
                            })
                        }
                        icon={<DeleteOutlined style={{ fontSize: 20, color: 'red' }} />}
                        type="text"
                    />
                </>
            ),
        },
    ];


    return (
        <div className="container">
            {loading ? (
                <Spin tip="Loading orders..." />
            ) : orders.length === 0 ? (
                <Alert message="No orders found" type="info" />
            ) : (
                <Table dataSource={orders} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
            )}

            {/* Modal chi tiết đơn hàng */}
            <Modal title="Order Details" open={isModalVisible} onCancel={handleCancel} footer={null}>
                {selectedOrder && (
                    <div>
                        {/* Hiển thị danh sách sản phẩm */}
                        <Title level={5}>Products:</Title>
                        {selectedOrder.products && selectedOrder.products.length > 0 ? (
                            selectedOrder.products.map((product) => (
                                <div key={product._id} className="border p-2 mb-2 flex">
                                    <img
                                        src={product.image || "/placeholder.png"}
                                        alt={product.title}
                                        width={100}
                                        height={100}
                                        style={{ objectFit: "cover", borderRadius: "8px" }}
                                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                                    />
                                    <div className="ml-3">
                                        <p><strong>{product.title}</strong></p>
                                        <p>Size: {product.size}</p>
                                        <p>Color: <span style={{ backgroundColor: product.color, padding: "2px 8px", borderRadius: "4px", display: "inline-block" }}>&nbsp;</span></p>
                                        <p>Quantity: {product.qty}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p><strong>No products found.</strong></p>
                        )}
                        
                        {/* Hiển thị địa chỉ giao hàng */}
                        <Title level={5}>Shipping Address:</Title>
                        {addresses[selectedOrder.shippingAddress.address] ? (
                            <div className='border p-2 mb-2 flex'>
                                <p><strong>Name:</strong> {addresses[selectedOrder.shippingAddress.address].name}</p>
                                <p><strong>Phone:</strong> {addresses[selectedOrder.shippingAddress.address].phoneNumber}</p>
                                <p><strong>Address:</strong> {addresses[selectedOrder.shippingAddress.address].address}</p>
                            </div>
                        ) : (
                            <p>Address not found</p>
                        )}

                        <p><strong>Status:</strong> {getOrderStatusTag(selectedOrder.status)}</p>

                        <p><strong>Payment Status:</strong> {getPaymentStatusTag(selectedOrder.paymentStatus)}</p>

                        <h2><strong>Total:</strong> {FormatCurrency.VND.format(selectedOrder.total)}</h2>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyOrders;