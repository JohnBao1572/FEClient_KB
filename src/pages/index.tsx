import { authSelector } from '@/reduxs/reducers/authReducer'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
// import Login from './auth/login';

const HomePage = () => {

  return <div>
    <Link href={'/auth/signup'}>signup </Link>
    
  </div>
}

export default HomePage
