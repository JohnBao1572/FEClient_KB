import { appInfo } from '@/constants/appInfos';
import { useParams } from 'next/navigation'
import React from 'react'

const ProductDetail = ({ pageProps }: any) => {
    const { product, subProducts } = pageProps.data.data;
    console.log(product, subProducts);
    return (
        <div>
            pro
        </div>
    )
}

export const getStaticProps = async (context: any) => {
    try {
        const response = await fetch(`${appInfo.baseURL}/products/detail?id=${context.params.id}`);
        const result = await response.json();
        return {
            props: {
                data: result,
            },
        };
    } catch (error) {
        return {
            props: {
                data: [],
            },
        };
    }
};

export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export default ProductDetail
