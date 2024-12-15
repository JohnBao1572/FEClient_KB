import handleAPI from '@/apis/handleAPI';
import { addAuth } from '@/reduxs/reducers/authReducer';
import { Button, Checkbox, Form, Input, message, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { BsArrowBarLeft, BsArrowLeft } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

interface SignUp {
	_id?: string;  // Thêm _id nếu cần
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}


const { Title, Paragraph } = Typography;
const signup = () => {

	const [isLoading, setIsLoading] = useState(false);
	const [isAgree, setIsAgree] = useState(true);
	// (<Signup>) ở đây là 1 interface hay type do tôi định nghĩa. Dữ liệu phức tạp, nhiều thuộc tính như { username: '', password: '' }
	const [signValues, setSignValues] = useState<SignUp>();

	// (<string[]>) là một mảng do user truyền vào. Danh sách, tập hợp các chuỗi như [] hoặc ['abc', 'xyz']
	const [numOfCode, setNumOfCode] = useState<string[]>([]);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const router = useRouter();

	// Khởi tạo biến xác nhận mã OTP khi mà nhập xong số sẽ tự động tiếp tục qua ô khác
	const inpRef1 = useRef<any>(null);
	const inpRef2 = useRef<any>(null);
	const inpRef3 = useRef<any>(null);
	const inpRef4 = useRef<any>(null);
	const inpRef5 = useRef<any>(null);
	const inpRef6 = useRef<any>(null);


	const handleSignUp = async (value: SignUp) => {
		const api = '/customers/add-new';
		setIsLoading(true);

		try {
			const res = await handleAPI({ url: api, data: value, method: 'post' });
			console.log(res)

			if (res.data) {
				setSignValues(res.data.data);
				console.log('Response data contains _id:', res.data.data._id);

				// inpRef1.current.focus();
			}

			//  router.push(`/`);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	const handleChangeNumsCode = (val: string, index: number) => {
		const items = [...numOfCode];
		items[index] = val;

		setNumOfCode(items);
	};

	const handleVerify = async () => {

		if (!signValues) {
			console.error("signValues is undefined or null");
			return;
		}
		console.log("signValues._id: ", signValues._id);


		if (numOfCode.length >= 6 && signValues) {
			let code = numOfCode.join('');
			// numOfCode.forEach((num) => (code += num));

			const api = `/customers/verify?id=${signValues._id}&code=${code.toUpperCase()}`;

			try {
				console.log(code.toUpperCase());
				const res = await handleAPI({ url: api, data: {
					id: signValues._id,
					code: code.toUpperCase(),
				  }, method: 'put', })

				console.log(res);

				// dispatch(addAuth(res.data));
				// localStorage.setItem('authData', JSON.stringify(res.data));
			} catch (error: any) {
				message: error.message;
				console.log(error);
			}
		}
	};

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
												value={numOfCode[0]}
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
												value={numOfCode[1]}
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
												value={numOfCode[2]}
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
												value={numOfCode[3]}
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
												value={numOfCode[4]}
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
												value={numOfCode[5]}
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
									</div>
								</>
							) : (
								<>
									<div className="mb-4">
										<Title className='m-0'>Create new account</Title>
										<Paragraph type='secondary'>Please enter details</Paragraph>
									</div>
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
								</>
							)}
						</div>
					</div>
				</div >
			</div >
		</div >
	)
}

export default signup
