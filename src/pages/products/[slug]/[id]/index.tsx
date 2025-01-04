import CarouselImages from '@/components/CarouselImages';
import HeadComponents from '@/components/HeadComponents';
import { appInfo } from '@/constants/appInfos';
import { ProductModel, SubProductModel } from '@/models/Product';
import { VND } from '@/utils/handleCurrency';
import { Breadcrumb, Button, Carousel, Rate, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const { Title, Paragraph, Text } = Typography;

const ProductDetail = ({ pageProps }: any) => {
    const { product, subProducts }: { product: ProductModel; subProducts: SubProductModel[]; } = pageProps.data.data;

    const [detail, setDetail] = useState<ProductModel>(product);
    const [subProductSelected, setSubProductSelected] = useState<SubProductModel>(subProducts[0] ?? []);

    console.log(subProductSelected);

    return (
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
                                <img
                                    // src={subProductSelected.images.length > 0 ? subProductSelected.images[0] : ''}
                                    src={subProductSelected.imgURL ? subProductSelected.imgURL : subProductSelected.images.length > 0 ? subProductSelected.images[0] : ''}
                                    style={{
                                        width: '50%',
                                    }}
                                    className="large-image" />
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
                                        {subProductSelected.qty > 0 ? 'In Stock' : 'Out of Stock'}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
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
