import handleAPI from '@/apis/handleAPI';
import { SubProductModel } from '@/models/Product';
import { authSelector, removeAuth } from '@/reduxs/reducers/authReducer'
import { addProduct, cartSelector } from '@/reduxs/reducers/cartReducer';
import { Affix, Avatar, Badge, Button, Drawer, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useDebugValue, useEffect, useState } from 'react'
import { BiCart, BiPowerOff } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoAccessibility, IoHeadsetOutline, IoHeartHalfOutline, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux'

const HeaderComponent = () => {
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const cart: SubProductModel[] = useSelector(cartSelector);
  // console.log(cart)

  useEffect(() => {
    cart.length > 0 && handleUpdateCartToDatabase(cart)
  }, [cart,auth])

  const handleUpdateCartToDatabase = async (data: any[]) => {
    // console.log(data);
    data.forEach(async (item) => {
      
      const api = `/carts/add-cart${item._id ? `?id=${item._id}` : ''}`;
      const value = {
        createdBy: item.createdBy,
        count: item.count,
        subProductId: item.subProductId,
        size: item.size,
        color: item.color,
        price: item.price,
        qty: item.qty,
        productId: item.productId,
      }
      try {
        // console.log(value)
        // console.log(api);
        const res = await handleAPI({ url: api, data: value, method: 'post', })
        console.log(res)
      } catch (error: any) {
        console.log(error);
      }
    })
  }

  // // Đồng bộ giỏ hàng với cơ sở dữ liệu khi có thay đổi
  // useEffect(() => {
  //   cart.length > 0 && handleUpdateCartToDatabase(cart)
  // }, [cart, auth]);
  // const handleUpdateCartToDatabase = async (data: any) => {
  //   // Lặp qua từng sản phẩm trong giỏ hàng
  //   for (const item of data) {
  //     const { createdBy, count, _id, size, color, price, qty } = item;

  //     // Kiểm tra dữ liệu của sản phẩm trước khi gửi lên API
  //     if (!count || !_id || !size || !color || !price || !qty) {
  //       console.error('Dữ liệu sản phẩm không đầy đủ:', item);
  //       continue;
  //     }

  //     const api = `/carts/add-cart${_id ? `?id=${_id}` : ''}`;
  //     const value = {
  //       createdBy: createdBy || auth._id,
  //       count: item.count,
  //       subProductId: item._id,
  //       size: item.size,
  //       color: item.color,
  //       price: item.price,
  //       qty: item.qty,
  //       productId: item.productId,
  //     };

  //     try {
  //       // Gửi yêu cầu lên API
  //       const res = await handleAPI({ url: api, data: value, method: 'post' });
  //       console.log('API Response:', res);

  //       // Kiểm tra phản hồi từ API
  //       if (!res || res.data?.status !== 'success') {
  //         console.error('Đồng bộ sản phẩm thất bại:', value);
  //       }
  //     } catch (error) {
  //       console.error('Lỗi khi đồng bộ giỏ hàng:', error);
  //     }
  //   }
  // };

  return (
    <Affix offsetTop={0}>
      <div className="container-fluid bg-white">
        <div className='p-3'>
          <div className="row">
            <div className='d-block d-sm-block d-md-none'>
              <Button
                type='text'
                icon={<GiHamburgerMenu size={22} />}
                onClick={() => setIsVisibleDrawer(true)}
              />
            </div>
            <div className="col d-none d-md-block">
              <img src="https://phuongnamvina.com/img_data/images/logo-shop-quan-ao.jpg" style={{ width: '100px' }} alt="" />
            </div>
            <div className="col text-center d-none d-md-block">
              <Menu
                style={{ border: 'none' }}
                mode='horizontal'
                items={[
                  {
                    label: <Link href={'/'}>Home</Link>,
                    key: 'home',
                  },

                  {
                    label: <Link href={'/shop'}>Shop</Link>,
                    key: 'shop',
                    children: [
                      {
                        label: 'Category',
                        key: 'category',
                      }
                    ]
                  },

                  {
                    label: <Link href={'/'}>Our story</Link>,
                    key: 'story',
                  },

                  {
                    label: <Link href={'/'}>Blog</Link>,
                    key: 'blog',
                  },

                  {
                    label: <Link href={'/'}>Contact Us</Link>,
                    key: 'contact',
                  },
                ]} />
            </div>
            <div className="col text-right">
              {/* Nếu đã có tài khoản rồi thì sẽ vào trang đăng nhập còn chưa thì sẽ chuyển tới trang đăng nhập */}
              <Space>
                <Button icon={<IoSearch size={20} />} type='text' />
                <Button icon={<IoHeartHalfOutline size={20} />} type='text' />
                <Button
                  icon={
                    <Badge count={cart.length}>
                      <BiCart size={20} />
                    </Badge>
                  }
                  type="text"
                />

                {auth.accesstoken && auth._id ? (
                  <Button onClick={() => {
                    dispatch(removeAuth({}))
                    localStorage.clear();
                  }}
                    danger type='text' icon={<BiPowerOff size={23} />}>
                  </Button>

                ) : (
                  <Button type='primary' onClick={() => router.push(`/auth/login`)} href={`/auth/login`}>Login</Button>
                )}
              </Space>

            </div>
          </div>
        </div>

        <Drawer
          open={isVisibleDrawer}
          onClick={() => setIsVisibleDrawer(false)}
          placement='left'>hello</Drawer>
      </div>

    </Affix>
  )
}

export default HeaderComponent
