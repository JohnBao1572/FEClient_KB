import handleAPI from '@/apis/handleAPI';
import { ProfileModel } from '@/models/ProfileModel';
import { authSelector } from '@/reduxs/reducers/authReducer';
import { Avatar, Button, Form, Input, Skeleton, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PersionalInfomations = () => {
    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [form] = Form.useForm();
    const auth = useSelector(authSelector);

    useEffect(() => {
        handleProfile();
    }, [auth._id, form]);

    const handleProfile = async () => {
        const api = `/customers/get-profile?id=${auth._id}`;

        setIsUpdating(true);
        try {
            const res = await handleAPI({ url: api, method: 'get' });
            setProfile(res.data.data);
            form.setFieldsValue(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateProfile = async (values: any) => {
        const api = `/customers/update?id=${auth._id}`;

        setIsUpdating(true);
        try {
            const res = await handleAPI({ url: api, data: values, method: 'put' });
            setProfile(res.data.data);
            message.success("Profile updated successfully");
        } catch (error) {
            console.log(error);
            message.error("Profile update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20, background: '#fff', borderRadius: 8 }}>
            {isUpdating ? (
                <Skeleton active />
            ) : (
                <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                        <Avatar size={100} src={profile?.photoURL} />
                    </div>

                    <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter your first name' }]}>
                        <Input placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter your last name' }]}>
                        <Input placeholder="Enter last name" />
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                        <Input placeholder="Enter email" disabled />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={isUpdating}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default PersionalInfomations;
