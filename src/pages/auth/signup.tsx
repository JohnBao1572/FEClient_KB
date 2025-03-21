/** @format */


import handleAPI from '@/apis/handleAPI';
import { addAuth } from '@/reduxs/reducers/authReducer';
import {
	Button,
	Checkbox,
	Divider,
	Form,
	Input,
	message,
	Space,
	Typography,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

interface SignUp {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const SignUp = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isAgree, setIsAgree] = useState(true);
	const [signValues, setSignValues] = useState<any>();
	const [numsOfCode, setNumsOfCode] = useState<string[]>([]);
	const [times, setTimes] = useState(40);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const router = useRouter();

	const inpRef1 = useRef<any>(null);
	const inpRef2 = useRef<any>(null);
	const inpRef3 = useRef<any>(null);
	const inpRef4 = useRef<any>(null);
	const inpRef5 = useRef<any>(null);
	const inpRef6 = useRef<any>(null);

	useEffect(() => {
		const time = setInterval(() => {
			setTimes((t) => t - 1);
		}, 3000);
		return () => clearInterval(time);
	}, []);

	const handleSignUp = async (values: SignUp) => {
		const api = `/customers/add-new`;
		setIsLoading(true);

		try {
			const res = await handleAPI({
				url: api,
				data: values,
				method: 'post',
			});

			if (res.data) {
				setSignValues(res.data.data);
			}
		} catch (error: any) {
			message.error(`User is existing`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangeNumsCode = (val: string, index: number) => {
		const items = [...numsOfCode];
		items[index] = val;

		setNumsOfCode(items);
	};

	const handleVerify = async () => {
		if (numsOfCode.length < 6) {
			message.error('Invalid code');
			return;
		}

		const code = numsOfCode.join('').toUpperCase();

		const api = `/customers/verify?id=${signValues._id}`;
		try {
			const res = await handleAPI({
				url: api,
				data: { code },
				method: 'put',
			});

			dispatch(addAuth(res.data.data));
			localStorage.setItem('authData', JSON.stringify(res.data.data));

			router.push('/');
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Verification failed.');
			console.error(error);
		}
	};


	const handleResendCode = async () => {
		const api = `/customers/resend-verify?id=${signValues._id}&email=${signValues.email}`;
		setNumsOfCode([]);
		try {
			await handleAPI({ url: api });
			setTimes(60);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='container-fluid' style={{ height: '100vh' }}>
			<div className='row' style={{ height: '100vh' }}>
				<div
					className='d-none d-md-block col-6 p-0'
					style={{
						backgroundImage: `url('https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/325906376_2074777692727406_1745368239073569186_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ispnTI4qAk4Q7kNvgGVNU4t&_nc_oc=AdkU-HjUPY5P7rOIqGHRGvkr8AbKCU6X0sWNGv0Mu3TDIp98bPhV-kbHY37FoZJNxW4&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=OLVVh_mKUueVg2OBb73nwg&oh=00_AYHYU50QMhZi1Trdy3LKyepL7KHMzs517Nn8mtbtlLzkEQ&oe=67E15DCD')`,
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
							{signValues ? (
								<>
									<Button
										onClick={() => setSignValues(undefined)}
										type='text'
										icon={<BsArrowLeft size={20} className='text-muted' />}>
										<Typography.Text>Back</Typography.Text>
									</Button>

									<div className='mt-4'>
										<Typography.Title level={2} className='m-0'>
											Enter OTP
										</Typography.Title>
										<Typography.Paragraph type='secondary'>
											We have share a code of your registered email address
											robertfox@example.com
										</Typography.Paragraph>
									</div>
									<div className='mt-4'>
										<div
											className='d-flex'
											style={{
												justifyContent: 'space-between',
											}}>
											<Input
												placeholder=''
												size='large'
												value={numsOfCode[0]}
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												ref={inpRef1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef2.current.focus();
														handleChangeNumsCode(val.target.value, 0);
													}
												}}
											/>
											<Input
												value={numsOfCode[1]}
												ref={inpRef2}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef3.current.focus();
														handleChangeNumsCode(val.target.value, 1);
													}
												}}
											/>
											<Input
												value={numsOfCode[2]}
												ref={inpRef3}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef4.current.focus();
														handleChangeNumsCode(val.target.value, 2);
													}
												}}
											/>
											<Input
												value={numsOfCode[3]}
												ref={inpRef4}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef5.current.focus();
														handleChangeNumsCode(val.target.value, 3);
													}
												}}
											/>
											<Input
												value={numsOfCode[4]}
												ref={inpRef5}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef6.current.focus();
														handleChangeNumsCode(val.target.value, 4);
													}
												}}
											/>
											<Input
												value={numsOfCode[5]}
												ref={inpRef6}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													handleChangeNumsCode(val.target.value, 5);
												}}
											/>
										</div>
									</div>
									<div className='mt-4'>
										<Button
											// disabled={numsOfCode.length < 6 || times < 0}
											loading={isLoading}
											type='primary'
											size='large'
											style={{ width: '100%' }}
											onClick={handleVerify}>
											Verify
										</Button>
										<div className='mt-2 text-center'>
											{times < 0 ? (
												<Button type='link' onClick={handleResendCode}>
													Resend
												</Button>
											) : (
												<Typography>Resend a new code: {times}s</Typography>
											)}
										</div>
									</div>
								</>
							) : (
								<>
									<div className='mb-4'>
										<Typography.Title className='m-0'>
											Create new account
										</Typography.Title>
										<Typography.Paragraph type='secondary'>
											Please enter detail
										</Typography.Paragraph>
									</div>
									<Form
										disabled={isLoading}
										form={form}
										layout='vertical'
										onFinish={handleSignUp}
										size='large'>
										<Form.Item name={'firstName'} label='First Name'>
											<Input placeholder='' allowClear />
										</Form.Item>
										<Form.Item name={'lastName'} label='Last Name'>
											<Input placeholder='' allowClear />
										</Form.Item>
										<Form.Item
											name={'email'}
											label='Email'
											rules={[
												{
													required: true,
													message: 'Please enter your email!',
												},
											]}>
											<Input placeholder='' type='email-address' allowClear />
										</Form.Item>
										<Form.Item
											name={'password'}
											label='Password'
											rules={[
												{
													message: 'Please enter your password!!',
													required: true,
												},
											]}>
											<Input.Password placeholder='Password!!!' />
										</Form.Item>
									</Form>
									<div className='mt-4'>
										<Checkbox
											onChange={(val) => setIsAgree(val.target.checked)}
											checked={isAgree}>
											I agree to Terms and Conditions
										</Checkbox>
									</div>
									<div className='mt-4'>
										<Button
											loading={isLoading}
											type='primary'
											size='large'
											style={{ width: '100%' }}
											onClick={() => form.submit()}>
											Sign Up
										</Button>

									</div>

									<Divider />

									<div className="mt-3 text-center">
										<Link href={`/auth/login`}>Login</Link>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
