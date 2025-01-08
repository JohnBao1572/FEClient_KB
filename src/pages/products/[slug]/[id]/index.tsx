import CarouselImages from '@/components/CarouselImages';
import HeadComponents from '@/components/HeadComponents';
import { appInfo } from '@/constants/appInfos';
import { ProductModel, SubProductModel } from '@/models/Product';
import { authSelector } from '@/reduxs/reducers/authReducer';
import { addProduct, cartSelector } from '@/reduxs/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import { Breadcrumb, Button, Carousel, message, Rate, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiHeart } from 'react-icons/bi';
import { CgAbstract, CgAdd } from 'react-icons/cg';
import { IoAddSharp } from 'react-icons/io5';
import { LuMinus } from 'react-icons/lu';
import { PiCableCar } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

const { Title, Paragraph, Text } = Typography;

const ProductDetail = ({ pageProps }: any) => {
    const { product, subProducts }: { product: ProductModel; subProducts: SubProductModel[]; } = pageProps.data.data;

    const [detail, setDetail] = useState<ProductModel>(product);
    const [subProductSelected, setSubProductSelected] = useState<SubProductModel>(subProducts[0] ?? []);
    const auth = useSelector(authSelector);
    const [count, setCount] = useState(1);
    const router = useRouter();
    const cart: SubProductModel[] = useSelector(cartSelector);
    const [instockQuantity, setInstockQuantity] = useState(subProductSelected?.qty);
    const dispatch = useDispatch();

    // Dùng (effect) là để khi vào product detail thì carousel sẽ set hình ảnh phần tử số 0 mà không phải là icon (PiCableCar)
    useEffect(() => {
        if (subProducts.length > 0) {
            setSubProductSelected({
                ...subProducts[0],
                imgURL: subProducts[0].images.length > 0 ? subProducts[0].images[0] : ''
            })
        }
    }, [subProducts])

    // console.log(subProductSelected);
    useEffect(() => {
        setCount(1);
    }, [subProductSelected])

    useEffect(() => {
        const item = cart.find(element => element._id === subProductSelected?._id);
        if (subProductSelected) {
            if (item) {
                const qty = subProductSelected?.qty - item.count
                setInstockQuantity(qty);
                console.log(qty);
            } else{
                setInstockQuantity(subProductSelected?.qty);
            }
        }

    }, [cart, subProductSelected])

    const handleCart = async () => {
        if (auth._id && auth.accesstoken) {
            if (subProductSelected) {
                // const item = subProductSelected;
                // const value = {
                //     createdBy: item.createdBy,
                //     count:item.count,
                //     subProductId: item._id,
                //     size: item.size,
                //     color: item.color,
                //     price: item.price,
                //     qty: item.qty,
                //     productId: item.productId,
                // }
                const item = {...subProductSelected, createdBy: auth._id, count};

                // console.log(item);

                // dispatch(addProduct(value));
                dispatch(addProduct(item));
            } else {
                message.error('Please choice a product add to cart');
            }
        }
        else {
            router.push(`/auth/login?productId=${detail._id}&slug=${detail.slug}`)
        }
    }

    const renderButtonGroup = () => {
        const item = cart.find(element => element._id === subProductSelected?._id)
        return (
            subProductSelected && (
                <>
                    <div className='in-deQuantityOfDetailProduct' >
                        <Button onClick={() => setCount(count + 1)}
                            disabled={count === (item ? subProductSelected.qty = item.count : subProductSelected.qty)}
                            icon={<IoAddSharp size={22} />} />
                        <Text className='text-in-deQuantityOfDetailProduct'>{count}</Text>
                        <Button onClick={() => setCount(count - 1)} disabled={count === 1} icon={<LuMinus size={22} />} />
                    </div >

                    <Button type='primary' style={{ minWidth: 200, height: 55 }}
                        onClick={handleCart}
                        disabled={item?.count === subProductSelected.qty}>
                        Add to Cart
                    </Button>
                </>

            )
        )
    }

    return subProductSelected ? (
        <div>
            <HeadComponents title={detail.title}
                description={detail.description}
                url={`${appInfo.baseURL}/products/${detail.slug}/${detail._id}`} />

            <div className="container-fluid mt-3 mb-5">
                <div className="container">
                    <Breadcrumb
                        items={[
                            {
                                key: 'home',
                                title: <Link href={'/'}>Home</Link>,
                            },

                            {
                                key: 'shop',
                                title: <Link href={'/shop'}>Shop</Link>,
                            },

                            {
                                key: 'title',
                                title: product.title,
                            },
                        ]} />

                    <div className="row mt-3">
                        <div className="col-sm-12 col-md-6">
                            <div className="bg-light text-center p-4">
                                {!subProductSelected.imgURL || subProductSelected.images.length === 0 ? (
                                    <PiCableCar size={50} className='text-muted' />
                                ) : (
                                    <img
                                        // src={subProductSelected.images.length > 0 ? subProductSelected.images[0] : ''}
                                        src={subProductSelected.imgURL ? subProductSelected.imgURL : subProductSelected.images.length > 0 ? subProductSelected.images[0] : ''}
                                        style={{
                                            width: '50%',
                                        }}
                                        className="large-image" />
                                )}

                            </div>

                            {/* <Space className='mt-2' wrap>
                                {subProducts.length > 0 &&
                                    subProducts.map((item) => (
                                        <a onClick={() => setSubProductSelected(item)}>
                                            <img className='shadow-hover'
                                                src={item.images.length > 0 ? item.images[0] : ''}
                                                style={{
                                                    width: 100,
                                                    height: 120,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </a>
                                    ))}
                            </Space> */}

                            <CarouselImages
                                items={subProducts}
                                onClick={(val) => setSubProductSelected(val)} />
                        </div>

                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <Typography.Title level={2}>{detail.title}</Typography.Title>
                                </div>
                                <div>
                                    <Tag color={subProductSelected.qty > 0 ? 'success' : 'error'}>
                                        {subProductSelected.qty > 0 ? `In Stock(${instockQuantity})` : 'Out of Stock'}
                                    </Tag>
                                </div>
                            </div>

                            <Space>
                                <Rate count={5} />
                                <Text type='secondary'>(5.0)</Text>
                                <Text type='secondary'>(1.900)</Text>
                            </Space>

                            <div className="mt-2">
                                <Space>
                                    <Typography.Title className='mt-0' level={2}
                                        style={{
                                            fontWeight: 300,
                                        }}>
                                        {VND.format(subProductSelected.discount ?? subProductSelected.price)}
                                    </Typography.Title>
                                    {
                                        subProductSelected.discount &&
                                        <Typography.Title className='mt-0' level={3}
                                            style={{
                                                fontWeight: 300,
                                                textDecoration: 'line-through',
                                            }}
                                            type='secondary'>
                                            {VND.format(subProductSelected.price)}
                                        </Typography.Title>
                                    }
                                </Space>
                            </div>

                            <div className="mt-1">
                                <Paragraph style={{ textAlign: 'justify', fontSize: '1rem' }}>
                                    {detail.description}
                                </Paragraph>
                            </div>

                            <div className="mt-1">
                                <Paragraph style={{
                                    fontSize: '1.1rem', fontWeight: 'bold'
                                }}>
                                    Colors
                                </Paragraph>
                                <Space>
                                    {subProducts.length > 0 && subProducts.map((item) => (
                                        <a onClick={() => setSubProductSelected(item)}>
                                            <div key={item._id}
                                                style={{
                                                    background: item.color,
                                                }}
                                                className='subProductDetail-color'>
                                            </div>
                                        </a>
                                    ))}
                                </Space>
                            </div>

                            <div className="mt-1">
                                <Paragraph style={{
                                    fontSize: '1.1rem', fontWeight: 'bold',
                                    margin: '10px',
                                }}>
                                    Sizes
                                </Paragraph>
                                <Space>
                                    {subProducts.length > 0 && subProducts.map((item) => (
                                        <a onClick={() => setSubProductSelected(item)}>
                                            <div key={item._id}>
                                                <Button
                                                    type={subProductSelected.size === item.size ? 'primary' : 'default'}
                                                    onClick={() => setSubProductSelected(item)}>
                                                    {item.size}
                                                </Button>
                                            </div>
                                        </a>
                                    ))}
                                </Space>
                            </div>

                            <div className="mt-3 parent-in-deQuantityOfDetailProduct">
                                <Space>
                                    {renderButtonGroup()}
                                    <Button icon={<BiHeart size={20} />} />
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : <></>
}

export const getStaticProps = async (context: any) => {
    try {
        const response = await fetch(`${appInfo.baseURL}/products/detail?id=${context.params.id}`);
        const result = await response.json();
        return {
            props: {
                data: result,
            },
        };
    } catch (error) {
        return {
            props: {
                data: [],
            },
        };
    }
};

export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export default ProductDetail
