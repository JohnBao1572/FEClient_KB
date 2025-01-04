import { authSelector, removeAuth } from '@/reduxs/reducers/authReducer'
import { Affix, Avatar, Button, Drawer, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { BiCart, BiPowerOff } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoAccessibility, IoHeadsetOutline, IoHeartHalfOutline, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux'

const HeaderComponent = () => {
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();

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
                <Button icon={<BiCart size={20} />} type='text' />
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
