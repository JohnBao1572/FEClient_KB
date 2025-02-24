import HeadComponents from '@/components/HeadComponents'
import { Form, Input } from 'antd';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import React from 'react'
import Title from 'antd/es/typography/Title';

const contact = () => {
    return (
        <>
            <HeadComponents title='Contact Us' />
            <div className="contact-container container-fluid">
                <Title level={2} className="contact-title">Liên hệ với chúng tôi</Title>

                <div className="contact-info">
                    <div className="info-item">
                        <MailOutlined /> <span>Email: jonnguyen1572@gmail.com</span>
                    </div>
                    <div className="info-item">
                        <PhoneOutlined /> <span>Hotline: 1900 1234</span>
                    </div>
                    <div className="info-item">
                        <EnvironmentOutlined /> <span>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default contact
