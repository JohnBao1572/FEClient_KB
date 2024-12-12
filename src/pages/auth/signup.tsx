import handleAPI from '@/apis/handleAPI';
import { addAuth } from '@/reduxs/reducers/authReducer';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

interface SignUp {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const { Title, Paragraph } = Typography;
const signup = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isAgree, setIsAgree] = useState(true);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const router = useRouter();

    const handleSignUp = async (value: SignUp) => {
        const api = `/customer/add-new`;
        setIsLoading(true);

        try {
            const res = await handleAPI({ url: api, data: value, method: 'post' });
            console.log(res)

            if(res.data){
                dispatch(addAuth(res.data));
                localStorage.setItem('authData', JSON.stringify(res.data));
            }

            router.push(`/`);
        } catch (error) {
            console.log(error);
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
                        <img src='https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/463017564_1601139527483767_1173139748525613168_n.jpg?stp=dst-jpg_s600x600&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=QhqDB73sg4MQ7kNvgGIK_8-&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AMUfAbmiwsFhfdJmBZKShxt&oh=00_AYATO1MNM8RBsVoRk2rpGKu7EgUlYHodWXOgV3ExCL-lLQ&oe=67251483' alt="" />
                    </div>
                    <h1 style={{ color: 'red' }} className='ml-5'>BaoThanh Shop</h1>
                </div>
                <div className="col-sm-12 col-md-6 p-0">
                    <div className="container d-flex"
                        style={{ height: '100%', alignItems: 'center' }}>
                        <div className="col-sm-12 col-lg-8 offset-lg-2">
                            <Title className='m-0'>Create new account</Title>
                            <Paragraph type='secondary'>Please enter details</Paragraph>
                            <Form disabled={isLoading} form={form} onFinish={handleSignUp} layout='vertical' size='large'>
                                <Form.Item name={'firstName'} label='First Name'>
                                    <Input placeholder='First name' allowClear />
                                </Form.Item>
                                <Form.Item name={'lastName'} label='Last Name'>
                                    <Input placeholder='Last name' allowClear />
                                </Form.Item>
                                <Form.Item name={'email'} label='Email' rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your email!!!'
                                    },
                                ]}>
                                    <Input placeholder='Email' type='email-address' allowClear />
                                </Form.Item>
                                <Form.Item name={'password'} label='Password'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your password!!'
                                        },
                                    ]}>
                                    <Input placeholder='Password' allowClear type='password' />
                                </Form.Item>
                            </Form>
                            <div className="mt-4">
                                <Checkbox onChange={val => setIsAgree(val.target.checked)} checked={isAgree}>
                                    I agree to the Terms & Condition
                                </Checkbox>
                            </div>
                            <div className='mt-4'>
                                <Button loading={isLoading} onClick={() => form.submit()} type='primary' style={{ width: '100%' }} size='large'>Signup</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default signup
