import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: [
    'antd',
    'rc-util',
    '@babel/runtime',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'rc-pagination',
    'rc-picker',
    'rc-tree',
    'rc-table',
  ],
};

export default nextConfig;
