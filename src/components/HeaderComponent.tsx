import { authSelector, removeAuth } from '@/reduxs/reducers/authReducer'
import { Avatar, Button } from 'antd';
import Link from 'next/link';
import React from 'react'
import { BiPowerOff } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux'

const HeaderComponent = () => {

    const auth = useSelector(authSelector);
    const dispatch = useDispatch();

  return (
    <div className='p-3'>
      <div className="row">
        <div className="col"></div>
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
                <Link href={`/auth/login`}>Đăng nhập</Link>
            )
        }
        </div>
      </div>
    </div>
  )
}

export default HeaderComponent
