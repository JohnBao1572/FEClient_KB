import handleAPI from '@/apis/handleAPI'
import { TabbarComponent } from '@/components'
import HeadComponents from '@/components/HeadComponents'
import HeaderComponent from '@/components/HeaderComponent'
import { appInfo } from '@/constants/appInfos'
import { CategoyModel } from '@/models/Product'
import { PromotionModel } from '@/models/PromotionModels'
import { authSelector } from '@/reduxs/reducers/authReducer'
import { Button, Card, Carousel, Space, Typography } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { BsArrow90DegLeft, BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { workerData } from 'worker_threads'

const { Title } = Typography;

const HomePage = (data: any) => {
  const pageProps = data.pageProps;
  const { promotions, categories }: { promotions: PromotionModel[], categories: CategoyModel[] } = pageProps;
  const [isLoading, setIsLoading] = useState(false);
  const [numOfColumn, setNumOfColumn] = useState(4);
  const [catsArrays, setCatsArrays] = useState<
    {
      key: string;
      values: CategoyModel[];
    }[]
  >([]);
  const catSliceRef = useRef<CarouselRef>(null);
  const router = useRouter();

  //Hiển thị các (cates) thẻ cha ra màn hình còn (catesCon) thì không xuất hiện
  const catsFilter = categories.length > 0 ? categories.filter((element) => !element.parentId) : [];
  console.log(catsFilter)

  // Đăng ký một sự kiện lắng nghe khi cửa sổ trình duyệt được thay đổi kích thước.
  // Mỗi lần trình duyệt thay đổi kích thước, hàm callback được gọi.
  useEffect(() => {
    window.addEventListener('resize', (event) => {
      const width = window.innerWidth;
      const index = width <= 480 ? 2 : width <= 768 ? 3 : 4;

      setNumOfColumn(index);
    });
    return () => window.removeEventListener('resize', () => { })
  }, [])

  useEffect(() => {
    const item: any[] = [];

    // Làm Math.ceil làm tròn số lên
    const numOfDatas = Math.ceil(catsFilter.length / numOfColumn);

    for (let index = 0; index < numOfDatas; index++) {
      // Cách hoạt động của slice: (array.splice(start, deleteCount))
      const values = catsFilter.slice(0, numOfColumn);

      item.push({
        // Tạo một chuỗi duy nhất cho mỗi đối tượng.
        // Ví dụ: Khi index = 0, key sẽ là "array0". Khi index = 1, key sẽ là "array1", và cứ tiếp tục
        key: `array${index}`,

        // Nếu values = ["Cat1", "Cat2", "Cat3"], thì nhóm này được gắn với key tương ứng như "array0".
        values,
      })
    }
    setCatsArrays(item);
  }, [numOfColumn])

  console.log(catsArrays);

  if (!Array.isArray(catsArrays) || catsArrays.length === 0) {
    return <div>Không có dữ liệu để hiển thị.</div>;
  }

  return (
    <>
      <HeadComponents title='BaoThanh Fashion' />

      <div className="container-fluid bg-light d-none d-md-block">
        <div className="container">
          {promotions && promotions.length > 0 ? (
            <Carousel
              style={{
                width: '100%',
                height: 500,
              }}
            >
              {promotions.map((item) => (
                // Dùng (map) là phải có key
                <div key={item._id}>
                  <img
                    src={item.imageURL}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      maxHeight: 500,
                    }}
                    alt=""
                  />
                  <div
                    style={{
                      backgroundColor: 'coral !important',
                      position: 'absolute',
                      top: '50%',
                      left: 20,
                      zIndex: 10,
                      padding: '10px',
                    }}
                  >
                    <Title className="m-0" style={{ color: 'white' }}>{item.title}</Title>
                    <Title
                      level={3}
                      className="m-0"
                      style={{
                        fontWeight: 300,
                        color: 'white',
                      }}
                    >
                      Up to {item.value} {item.type === 'percent' ? '%' : ''}
                    </Title>
                    <div className="mt-4">
                      <Button
                        iconPosition="end"
                        size="large"
                        style={{ backgroundColor: 'black', color: 'white' }}>
                        Shop now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Title level={3}>No promotions available</Title>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ position: 'relative' }}>
        <TabbarComponent title={'Shop category'}
          right={
            <Space>
              <Button onClick={() => catSliceRef.current?.next()}
                icon={<BsArrowLeft size={18} />} />

              <Button onClick={() => catSliceRef.current?.next()}
                icon={<BsArrowRight size={18} />} />
            </Space>
          } />
        <Carousel autoplay
          speed={2000}
          ref={catSliceRef}
          initialSlide={0}>
          {catsArrays.map((array) => (
            <div>
              <div className='row' key={array.key}>
                {array.values.map((item) => (
                  <div className='col' key={item._id || item.title || Math.random()}>
                    {
                      <div>
                        <img src={item.image ?? 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-ngay-moi-hanh-phuc-sieu-cute-inkythuatso-09-13-35-50.jpg'}
                          alt={item.title ?? 'Image have not a title'}
                          style={{ width: '100%', maxHeight: 180, borderRadius: 12 }} />

                        <div className='text-center'
                          style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            left: 10,
                          }}>
                          <Button style={{ width: '80%' }} size='large'
                          onClick={() => router.push(`/filterProduct?catId=${item._id}`)}>
                          {item.title}
                          </Button>
                        </div>
                      </div>
                    }
                  </div>
                ))}
              </div>
            </div>

          ))}
        </Carousel>
      </div>
    </>
  )
}

export default HomePage

// export async function getStaticProps() {
//   // Dữ liệu mẫu để tránh lỗi khi không có dữ liệu từ API
//   const promotions = [
//     { _id: '1', imageURL: '/images/sample1.jpg', title: 'Giảm giá 50%', value: 50, type: 'percent' },
//     { _id: '2', imageURL: '/images/sample2.jpg', title: 'Mua 1 tặng 1', value: 1, type: 'amount' },
//   ];

//   return {
//     props: {
//       promotions, // Trả về dữ liệu mẫu để khởi tạo component
//     },
//   };
// }

export const getStaticProps = async () => {
  try {
    // Hàm fetch trả về một đối tượng Response. Bạn cần gọi .json() để chuyển đổi dữ liệu trả về thành JSON.

    // Với fetch, bạn cần xử lý .json() để lấy dữ liệu từ phản hồi.
    // axios tự động chuyển đổi phản hồi JSON thành đối tượng JavaScript.

    const response = await fetch(`${appInfo.baseURL}/promotions/get-promotions?limit=5`);
    const responseCats = await fetch(`${appInfo.baseURL}/products/get-categories`)

    // const response = await fetch(`http://localhost:5000/promotions/get-promotions`);
    // const { data } = await axios.get('http://localhost:5000/promotions/get-promotions');
    if (!response.ok) {
      throw new Error(`Failed to fetch promotions: ${response.statusText}`);
    }

    const promotions = await response.json();
    const data = promotions?.data || [];

    const resultCats = await responseCats.json();
    const dataCats = resultCats?.data || [];

    return {
      props: {
        promotions: data,
        categories: dataCats,
      },
    };
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return {
      props: {
        data: {
          promotions: [], // Trả về một mảng trống để tránh lỗi khi render.
        },
      },
    };
  }
};

