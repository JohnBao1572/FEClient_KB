import { Tabs, Typography } from 'antd';
import { FaUser } from 'react-icons/fa6';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProsionalInfomation from '../../components/PersionalInfomations';
import { authSelector } from '@/reduxs/reducers/authReducer';
import { FaShoppingCart } from 'react-icons/fa';
import MyOrders from '@/components/MyOrders';

const ProfilePage = () => {
	const [activeTab, setActiveTab] = useState<string>('edit'); 
	const auth = useSelector(authSelector);

	const profileTabs = [
		{
			key: 'edit',
			label: 'Personal Informations',
			icon: <FaUser size={16} />,
		},
		{
			key: 'orders',
			label: 'My Orders',
			icon: <FaShoppingCart size={16} />,
		},
	];

	return (
		<div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
			<div
				style={{
					display: 'flex',
					width: '90%',
					maxWidth: '1300px',
					background: '#fff',
					borderRadius: '10px',
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
					overflow: 'hidden',
				}}
			>
				{/* Sidebar */}
				<div
					style={{
						width: '250px',
						background: '#f8f9fa',
						padding: '20px',
						borderRight: '1px solid #ddd',
					}}
				>
					<Tabs
						tabPosition="left"
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key)}
						items={profileTabs.map((tab) => ({
							key: tab.key,
							label: (
								<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									{tab.icon}
									{tab.label}
								</span>
							),
						}))}
					/>
				</div>

				{/* Content */}
				<div style={{ flex: 1, padding: '30px' }}>
					{activeTab === 'edit' && (
						<>
							<Typography.Title level={2} type='secondary'>My Profile</Typography.Title>
							<ProsionalInfomation />
						</>
					)}
					{activeTab === 'orders' && (
						<>
							<Typography.Title level={2} type='secondary'>My Orders</Typography.Title>
						<MyOrders />
						</>
						)}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
