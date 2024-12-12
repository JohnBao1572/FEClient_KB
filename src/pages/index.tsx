import HeaderComponent from '@/components/HeaderComponent'
import { authSelector } from '@/reduxs/reducers/authReducer'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
// import Login from './auth/login';

const HomePage = () => {

  return <div>
    <Link href={`/auth/signup`}>dang ky</Link>
  </div>
}

export default HomePage
