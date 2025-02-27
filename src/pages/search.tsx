import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Input, List, Skeleton, Typography } from 'antd';
import ProductItem from '@/components/ProductItem';
import { ProductModel } from '@/models/Product';

const { Title } = Typography;

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Gọi API tìm kiếm sản phẩm của bạn
      fetch(`http://localhost:5000/products/get-title-product?title=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.data); // Giả sử dữ liệu trả về có dạng { data: [...] }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="container">
      <Title level={2}>Search Results for "{query}"</Title>
      {loading ? (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={[1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={() => (
            <List.Item>
              <Skeleton active />
            </List.Item>
          )}
        />
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={searchResults}
          renderItem={(item) => (
            <List.Item>
              <ProductItem item={item} />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchPage;