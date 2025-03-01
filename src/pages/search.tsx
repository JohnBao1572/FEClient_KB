import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Input, List, Skeleton, Typography } from 'antd';
import ProductItem from '@/components/ProductItem';
import { ProductModel } from '@/models/Product';
import handleAPI from '@/apis/handleAPI';

const { Title } = Typography;

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query as string, setSearchResults, setLoading);
    }
  }, [query]);

  const fetchSearchResults = async (query: string, setSearchResults: (data: ProductModel[]) => void, setLoading: (loading: boolean) => void) => {
    const api = `/products/get-title-product?title=${query}`
    setLoading(true);
    try {
      const res = await handleAPI({url:api, method: 'get'})
      
      setSearchResults(res.data.data); // Giả sử dữ liệu trả về có dạng { data: [...] }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

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