import { VND } from '@/utils/handleCurrency';
import {
    Avatar,
    Button,
    Card,
    Divider,
    Input,
    List,
    message,
    Modal,
    Result,
    Space,
    Steps,
    Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { BiCreditCard, BiEdit } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

import { DateTime } from '@/utils/dateTime';

import { useRouter } from 'next/router';
import { AddressModel } from '@/models/Product';
import { CartItemModel, cartSelector, removeCarts } from '@/reduxs/reducers/cartReducer';
import { authSelector } from '@/reduxs/reducers/authReducer';
import handleAPI from '@/apis/handleAPI';
import ShipingAddress from './components/ShipingAddress';
import PaymentMethod, { methods } from './components/PaymentMethod';
import { Sectioin } from '@/components';
import ListCart from './components/ListCart';
import HeadComponents from '@/components/HeadComponents';

const { Title, Text, Paragraph } = Typography;

interface PaymentDetail {
    address: AddressModel;
    paymentMethod: any;
}

const CheckoutPage = () => {
    const [discountCode, setDiscountCode] = useState('');
    const [discountValue, setDiscountValue] = useState<{
        value: number;
        type: string;
    }>();
    const [grandTotal, setGrandTotal] = useState(0);
    const [isCheckingCode, setIsCheckingCode] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>();
    const [paymentDetail, setPaymentDetail] = useState<any>();
    const [paymentMethod, setPaymentMethod] = useState<{
        methodSelected: string;
    }>();
    const [isLoading, setIsLoading] = useState(false);

    const carts: CartItemModel[] = useSelector(cartSelector);
    const user = useSelector(authSelector);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (carts.length > 0) {
            const total = carts.reduce((a, b) => a + b.count * b.price, 0);
            if (discountValue) {
                setGrandTotal(
                    discountValue.type === 'percent'
                        ? Math.ceil(total - total * (discountValue.value / 100))
                        : total - discountValue.value
                );
            } else {
                setGrandTotal(total); // Cập nhật grandTotal khi không có mã giảm giá
            }
        }
    }, [discountValue, carts]);

    const handleCheckDiscountCode = async () => {
        const api = `/promotions/check?code=${discountCode}`;
        setIsCheckingCode(true);
        try {
            const res: any = await handleAPI({ url: api });
            const data = res.data.data;
            setDiscountValue(data);
            message.success('Add discount code success');
        } catch (error: any) {
            console.log(error);
            message.error(error.response.data.message);
        } finally {
            setIsCheckingCode(false);
        }
    };

    const renderComponents = () => {
        switch (currentStep) {
            case 0:
                return (
                    <ShipingAddress
                        onSelectAddress={(val) => {
                            setPaymentDetail({ ...paymentDetail, address: val });
                            setCurrentStep(1);
                        }}
                    />
                );
            case 1:
                return (
                    <PaymentMethod
                        onContinue={(val) => {
                            setPaymentMethod(val);
                            setCurrentStep(2);
                        }}
                    />
                );
            case 2:
                return (
                    <>
                        <Sectioin>
                            <Title level={4}>
                                Estimated delivery:{' '}
                                {DateTime.getShortDateEng(
                                    new Date(
                                        new Date().getTime() + 3 * 24 * 60 * 60 * 1000
                                    ).toISOString()
                                )}
                            </Title>
                            <List
                                dataSource={carts}
                                renderItem={(item) => (
                                    <List.Item key={item._id}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src={item.image} shape='square' size={72} />
                                            }
                                            title={
                                                <Title level={4} className='mb-1'>
                                                    {item.title}
                                                </Title>
                                            }
                                            description={
                                                <>
                                                    <Paragraph type='secondary' className='m-0'>
                                                        ${VND.format(item.price)}
                                                    </Paragraph>
                                                    <Paragraph type='secondary' className='m-0'>
                                                        size: {item.size}
                                                    </Paragraph>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sectioin>
                        <Sectioin>
                            <Title level={4}>Shipping address</Title>
                            <List
                                dataSource={[paymentDetail]}
                                renderItem={(item) => (
                                    <List.Item
                                        extra={
                                            <Button
                                                onClick={() => setCurrentStep(0)}
                                                icon={<BiEdit size={20} />}
                                                className='text-muted'
                                                type='text'
                                            />
                                        }>
                                        <List.Item.Meta
                                            title={`${item.address.name} ${item.address.phoneNumber}`}
                                            description={item.address.address}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sectioin>
                        <Sectioin>
                            <Title level={4}>Paymen method</Title>
                            <Paragraph>
                                {paymentMethod &&
                                    methods.find(
                                        (element) => element.key === paymentMethod.methodSelected
                                    )?.title}
                            </Paragraph>
                        </Sectioin>
                    </>
                );
            default:
                return <ListCart />;
        }
    };

    const handlePaymentOrder = async () => {
        /*
            
            products,
            total,
            status: 0, 1, 2, 4
            createdAt,
            shippingAddress,
            paymentStatus: 0, 1,2 
            paymentMethod: 'cod'
        */

        const data = {
            products: carts,
            total: grandTotal, // Sử dụng giá trị grandTotal đã tính toán
            shippingAddress: paymentDetail,
            paymentMethod: paymentMethod?.methodSelected ?? '',
            discountCode, // Thêm mã giảm giá vào dữ liệu gửi lên server
        };

        setIsLoading(true);
        try {
            const res = await handleAPI({
                url: '/payments/add-bill',
                data,
                method: 'post',
            });

            await handleAPI({
                url: '/carts/clear-carts',
            });

            // gọi api gửi mail thông báo cho người dùng

            dispatch(removeCarts({}));

            Modal.confirm({
                type: 'success',
                title: 'Order successfully',
                content: 'Thank you for your order, your order is being processed',
                onOk: () => router.push('/profile?key=orders'),
                okButtonProps: {
                    title: 'View Order',
                    type: 'primary',
                },
                cancelText: 'Back to home',
                onCancel: () => router.push('/'),
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container-fluid'>
            <div className='container mt-4'>
                <HeadComponents title='Checkout' />
                <div className='row'>
                    <div className='col-sm-12 col-md-8'>
                        <div className='mb-4'>
                            <Steps
                                current={currentStep}
                                labelPlacement='vertical'
                                onChange={(val) => setCurrentStep(val)}
                                items={[
                                    {
                                        title: 'Address',
                                        icon: (
                                            <Button
                                                icon={<HiHome size={18} />}
                                                type={currentStep === 0 ? 'primary' : `text`}
                                                onClick={() => setCurrentStep(0)}
                                            />
                                        ),
                                    },
                                    {
                                        title: 'Payment Method',
                                        icon: (
                                            <Button
                                                icon={<BiCreditCard size={20} />}
                                                type={currentStep === 1 ? 'primary' : `text`}
                                                onClick={() => setCurrentStep(1)}
                                            />
                                        ),
                                    },
                                    {
                                        title: 'Reviews',
                                        icon: (
                                            <Button
                                                icon={<FaStar size={18} />}
                                                type={currentStep === 2 ? 'primary' : `text`}
                                                onClick={undefined}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </div>

                        {renderComponents()}
                    </div>
                    <div className='col-sm-12 col-md-4 mt-5 '>
                        <Card
                            title='Subtotal'
                            extra={
                                <Typography.Title level={3} className='m-0'>
                                    {VND.format(carts.reduce((a, b) => a + b.count * b.price, 0))}
                                </Typography.Title>
                            }>
                            <div className='mt-3'>
                                <Typography.Text type='secondary'>
                                    Discount code
                                </Typography.Text>
                                <Space.Compact className='mb-3'>
                                    <Input
                                        size='large'
                                        placeholder='code'
                                        allowClear
                                        value={discountCode}
                                        onChange={(val) =>
                                            setDiscountCode(val.target.value.toUpperCase())
                                        }
                                    />
                                    <Button
                                        loading={isCheckingCode}
                                        onClick={handleCheckDiscountCode}
                                        disabled={!discountCode}
                                        type='primary'
                                        size='large'>
                                        Apply
                                    </Button>
                                </Space.Compact>
                                <Space style={{ justifyContent: 'space-between' }}>
                                    <Typography.Text style={{ fontSize: 18 }}>
                                        Delivery charge:
                                    </Typography.Text>
                                    {discountValue && (
                                        <Typography.Text
                                            style={{
                                                fontSize: 18,
                                            }}>{`${discountValue?.value}${discountValue?.type === 'percent' ? '%' : ''
                                                }`}</Typography.Text>
                                    )}
                                </Space>
                                <Divider />
                                <Space style={{ justifyContent: 'space-between' }}>
                                    <Typography.Title level={4}>Grand Total:</Typography.Title>
                                    <Typography.Title level={4}>{`${VND.format(
                                        grandTotal
                                    )}`}</Typography.Title>
                                </Space>
                            </div>
                            <div className='mt-3'>
                                <Button
                                    disabled={
                                        currentStep !== undefined &&
                                        (!paymentMethod || !paymentDetail)
                                    }
                                    type='primary'
                                    onClick={() =>
                                        !currentStep ? setCurrentStep(0) : handlePaymentOrder()
                                    }
                                    size='large'
                                    style={{ width: '100%' }}>
                                    Process to Checkout
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;