import handleAPI from '@/apis/handleAPI';
import { ProfileModel } from '@/models/ProfileModel';
import { addAuth, authSelector } from '@/reduxs/reducers/authReducer';
import { Avatar, Button, Form, Input, Spin, Upload, UploadFile, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { BiCamera, BiEdit } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const PersionalInfomations = () => {
    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [file, setFile] = useState<UploadFile | null>(null);

    const [form] = Form.useForm();
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();

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
            console.log(res);
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
            if (file && file.originFileObj) {
                const formData = new FormData();
                formData.append('file', file.originFileObj);
                const response = await axios.post('/upload', formData);
                const imageUrl = response.data.url;
                values.photoURL = imageUrl;
            }

            const res = await handleAPI({ url: api, data: values, method: 'put' });
            setProfile(res.data.data);
            console.log(res);
            message.success("Profile updated successfully");
        } catch (error) {
            console.log(error);
            message.error("Profile update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFileChange = ({ file }: any) => {
        setFile(file);
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20, background: '#fff', borderRadius: 8 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>My Profile</h2>

            {isUpdating ? (
                <Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center' }} />
            ) : (
                <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                        >
                            <Avatar
                                size={100}
                                src={profile?.photoURL}
                                style={{ cursor: 'pointer' }}
                            />
                        </Upload>
                        <Upload showUploadList={false} beforeUpload={() => false} onChange={handleFileChange}>
                            <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>Upload Photo</Button>
                        </Upload>
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
                        <Button type="primary" htmlType="submit" block loading={isUpdating}>Save</Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default PersionalInfomations;