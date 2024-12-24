
import handleAPI from '@/apis/handleAPI';
import { addAuth } from '@/reduxs/reducers/authReducer';
import { Button, Divider, Form, Input, message, Typography } from 'antd';
import { url } from 'inspector';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

const { Title, Paragraph } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [form] = Form.useForm();
  const handleLogin = async (values: { email: string, password: string }) => {
    const api = `/customers/login`;
    setIsLoading(true);
    try {
      const res = await handleAPI({ url: api, data: values, method: 'post' });
      console.log(res.data.data);

      dispatch(addAuth(res.data.data));
      localStorage.setItem('authData', JSON.stringify(res.data.data));

      router.push('/');
    } catch (error) {
      message.error('Login error');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='container-fluid' style={{ height: '100vh' }}>
      <div className="row" style={{ height: '100vh' }}>
        <div className="d-none d-md-block col-6 p-0"
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}>
          <div className='mt-5 ml-5'
            style={{ backgroundColor: 'transpanrent' }}>
            <img src='https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/463126228_1601139550817098_781453919604992999_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=tgWMR_Vlo4YQ7kNvgEofm-w&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=AbIJq0hw7BtczW4nzow1v9h&oh=00_AYADTbjprsbTMfOVgZPFcndp2ZoCjAnZwsXMBZ-e8BoAjw&oe=6762097A' alt="HinhAnhdangbiloi" width='100%' height='580px' />
          </div>
          <h1 style={{ color: 'red' }} className='ml-5'>BaoThanh Shop</h1>
        </div>
        <div className="col-sm-12 col-md-6 p-0">
          <div className="container d-flex"
            style={{ height: '100%', alignItems: 'center' }}>
            <div className="col-sm-12 col-lg-8 offset-lg-2">
              <Title className='m-0'>Welcome</Title>
              <Paragraph type='secondary'>Please enter your account here</Paragraph>

              <div className="mt-4">
                <Form disabled={isLoading} layout='vertical' onFinish={handleLogin} size='large' form={form}>
                  <Form.Item name={'email'} label='Email address' rules={[{
                    required: true,
                    message: 'Please input your email address'
                  }]}>
                    <Input allowClear placeholder='Email address' />
                  </Form.Item>
                  <Form.Item name={'password'} label='Password' rules={[{
                    required: true,
                    message: 'Please input your password',
                  }]}>
                    <Input.Password placeholder='password' />
                  </Form.Item>
                </Form>

                <div className="mt-3 text-right">
                  <Link href={'/auth/forgot-password'}>Forgot password</Link>
                </div>

                <div className="mt-3">
                  <Button disabled={isLoading}
                    type='primary'
                    size='large'
                    style={{ width: '100%' }}
                    onClick={() => form.submit()}>
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    </div >
  )
}

export default Login
