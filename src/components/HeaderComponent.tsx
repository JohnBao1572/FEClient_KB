import { authSelector, removeAuth } from '@/reduxs/reducers/authReducer'
import { Avatar, Button, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { BiPowerOff } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux'

const HeaderComponent = () => {

    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const router = useRouter();

  return (
    <div className='p-3'>
      <div className="row">
        <div className="col">
          <img src="https://phuongnamvina.com/img_data/images/logo-shop-quan-ao.jpg" style={{width: '100px'}} alt="" />
        </div>
        <div className="col text-center">
          <Menu 
          style={{border: 'none'}}
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
                  key:'category',
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
          ]}/>
        </div>
        <div className="col text-right">
            {/* Nếu đã có tài khoản rồi thì sẽ vào trang đăng nhập còn chưa thì sẽ chuyển tới trang đăng nhập */}
            {auth.accesstoken && auth._id    ? (

                <Button onClick={()=>{
                    dispatch(removeAuth({}))
                    localStorage.clear();
                }} 
                danger type='text' icon={<BiPowerOff  size={23}/>}>
                </Button>
                
            ) : (
                <Button type='primary' onClick={()=> router.push(`/auth/login`)} href={`/auth/login`}>Login</Button>
            )
        }
        </div>
      </div>
    </div>
  )
}

export default HeaderComponent
