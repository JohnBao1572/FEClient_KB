import { Typography } from 'antd'
import React, { ReactNode } from 'react'

interface Props {
    title: string,

    // Có thể nhận bất kỳ giá trị như một phần tử JSX, chuỗi văn bản, hoặc một mảng các phần tử.như một phần tử JSX, chuỗi văn bản, hoặc một mảng các phần tử.
    right?: ReactNode,
    level?: 1 | 2 | 3 | 4 | 5 | undefined,
}

const { Title, Text, Paragraph } = Typography;

const TabbarComponent = (props: Props) => {
    const { title, right, level } = props;

    return (
        <div>
            <div className="row">
                <div className={`col ${!right && 'text-left'}`}>
                    <Title style={{fontWeight: 300}} level={level ?? 1}>{title}</Title>
                </div>
                {right && right}
            </div>
        </div>
    )
}

export default TabbarComponent
