/** @format */


import handleAPI from '@/apis/handleAPI';
import { addAuth } from '@/reduxs/reducers/authReducer';
import { Button, Divider, Form, Input, message, Typography } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const { Title, Paragraph } = Typography;

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const router = useRouter();

	const [form] = Form.useForm();

	const searchParams = useSearchParams();

	const id = searchParams.get('productId');
	const slug = searchParams.get('slug');

	const handleLogin = async (values: { email: string; password: string }) => {
		const api = `/customers/login`;
		setIsLoading(true);

		try {
			const res = await handleAPI({
				url: api,
				data: values,
				method: 'post',
			});

			dispatch(addAuth(res.data.data));
			localStorage.setItem('authData', JSON.stringify(res.data.data));

			router.push(id && slug ? `/products/${slug}/${id}` : '/');
		} catch (error) {
			console.log(error);
			message.error(
				'Đăng nhập thất bại, vui lòng kiểm tra lại email/password và thử lại'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container-fluid' style={{ height: '100vh' }}>
			<div className='row' style={{ height: '100vh' }}>
				<div
					className='d-none d-md-block col-6 p-0'
					style={{
						backgroundImage: `url('https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/325906376_2074777692727406_1745368239073569186_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=k1K8blZavXkQ7kNvgERXIZL&_nc_oc=AdiY8xnnmhnX-yyBx6URsnberuRVvaG6hpgd3-0VPNSTHmVlHjJdlW3Woref0QrOO0o&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=A7d4mPhXMELk8PScvZSyjSa&oh=00_AYAbIY4z2anw0x9C-CApmhmdDG9nqv1kwXm7rFlDOru_mw&oe=67B6148D')`,
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						width: '100%',
						height: '100%',
					}}>
					<div className='mt-5 ml-5' style={{ backgroundColor: 'transparent' }}>
						<img
							alt=''
							style={{ backgroundColor: 'transparent', width: '400px', height: '120px' }}
						/>
					</div>
				</div>
				<div className='col-sm-12 col-md-6'>
					<div
						className='container d-flex'
						style={{ height: '100%', alignItems: 'center' }}>
						<div className='col-sm-12 col-md-12 col-lg-8 offset-lg-2'>
							<Title className='m-0'>Welcome</Title>
							<Paragraph type='secondary'>Please login here</Paragraph>

							<div className='mt-4'>
								<Form
									disabled={isLoading}
									layout='vertical'
									onFinish={handleLogin}
									size='large'
									form={form}>
									<Form.Item
										name={'email'}
										label='Email address'
										rules={[
											{
												required: true,
												message: 'Please enter your email',
											},
										]}>
										<Input placeholder='Email' allowClear />
									</Form.Item>
									<Form.Item
										name={'password'}
										label='Password'
										rules={[
											{
												required: true,
												message: 'Please enter your password',
											},
										]}>
										<Input.Password placeholder='Password!!!' />
									</Form.Item>
								</Form>

								{/* <div className='mt-3 text-right'>
									<Link href={'/auth/forgot-password'}>Forgot Password</Link>
								</div> */}

								<div className='mt-3'>
									<Button
										type='primary'
										loading={isLoading}
										size='large'
										style={{ width: '100%' }}
										onClick={() => form.submit()}>
										Login
									</Button>
								</div>
								<Divider />
								<div className='mt-3 text-center'>
									<Link href={`/auth/signup`}>Sign Up</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
