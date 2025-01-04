import { colors } from '@/constants/colors';
import { ProductModel } from '@/models/Product'
import { VND } from '@/utils/handleCurrency';
import { Button, Space, Typography } from 'antd';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { BsEye } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { IoMdStarOutline } from 'react-icons/io';
import { MdImage } from 'react-icons/md';
import { TbTransfer } from 'react-icons/tb';

interface Props {
    item: ProductModel;
}

const { Title, Text, Paragraph } = Typography;

const ProductItem = (props: Props) => {
    const { item } = props;
    const [elementWidth, setElementWidth] = useState();
    const ref = useRef<any>();

    useEffect(() => {
        const width = ref.current?.offsetWidth;
        setElementWidth(width);
    })

    console.log(item);


    return (
        <Link href={`/products/${item.slug}/${item._id}`} 
        className="col-sm6 col-md-4 col-lg-3 mb-4 product-bestSeller-item" 
        key={item._id} 
        ref={ref}>
            <div>
                {item.images.length > 0 ? (
                    <img src={item.images.length > 0 ? item.images[0] : 'https://png.pngtree.com/png-vector/20220326/ourmid/pngtree-best-seller-product-iconic-png-image_4513138.png'}
                        style={{
                            width: '100%',

                            // Đảm bảo chiều cao thay đổi theo chiều rộng khi kích thước phần tử thay đổi (responsive).
                            // Có giá trị mặc định khi chưa tính được chiều rộng của phần tử.
                            height: elementWidth ? elementWidth * 1.1 : 250,
                        }} />
                ) : (
                    <div style={{
                        width: '100%',
                        height: 250,
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <MdImage size={32} color={colors.gray600} />
                    </div>
                )}
            </div>

            <div className='button-container'>
                <div className='btn-list text-right  pr-2'
                    style={{ height: (elementWidth ? elementWidth * 1.1 : 250) * 0.8 }}>
                    <Space direction='vertical'>
                        <Button className='icon-addCart' icon={<IoMdStarOutline size={18} className='text-muted' color={colors.primary500}/>} />
                        <Button className='icon-addCart' icon={<TbTransfer size={18} className='text-muted' color={colors.primary500}/>} />
                        <Button className='icon-addCart' icon={<BsEye size={18} className='text-muted' color={colors.primary500}/>} />
                    </Space>
                </div>

                <div className='text-center'>
                    <Button className='btn-addCart text-center' style={{ width: '80%' }}>Add to Cart</Button>
                </div>
            </div>

            <div className="p-2">
                {/* <Paragraph >{item.supplier}</Paragraph> */}
                <Paragraph style={{ fontWeight: 'bold' }}>{item.title}</Paragraph>
                <Paragraph style={{ fontSize: 17 }}>{item.price.length > 0 ? `${VND.format(item.price[0])} - ${VND.format(item.price[1])}`: ''}</Paragraph>
            </div>
        </Link>
    )
}

export default ProductItem
