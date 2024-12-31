import handleAPI from '@/apis/handleAPI'
import { TabbarComponent } from '@/components'
import HeadComponents from '@/components/HeadComponents'
import HeaderComponent from '@/components/HeaderComponent'
import { appInfo } from '@/constants/appInfos'
import { CategoyModel } from '@/models/Product'
import { PromotionModel } from '@/models/PromotionModels'
import { authSelector } from '@/reduxs/reducers/authReducer'
import { Button, Card, Carousel, Typography } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsArrow90DegLeft, BsArrowRight } from 'react-icons/bs'
import { useSelector } from 'react-redux'

const { Title } = Typography;

const HomePage = (data: any) => {
  const pageProps = data.pageProps;
  const { promotions, categories }: { promotions: PromotionModel[], categories: CategoyModel[] } = pageProps;
  const [isLoading, setIsLoading] = useState(false);

  //Hiển thị các (cates) thẻ cha ra màn hình còn (catesCon) thì không xuất hiện
  const catsFilter = categories.length> 0 ? categories.filter((element) => !element.parentId) : [];
  console.log(catsFilter)

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
                    <Title className="m-0">{item.title}</Title>
                    <Title
                      level={3}
                      className="m-0"
                      style={{
                        fontWeight: 300,
                      }}
                    >
                      Up to {item.value} {item.type === 'percent' ? '%' : ''}
                    </Title>
                    <div className="mt-4">
                      <Button
                        iconPosition="end"
                        size="large"
                      >
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
        <TabbarComponent title={'Shop category'} />

        <div className="row">
          {catsFilter.map((cat) =>(
            <div key={cat._id}>
              <div className="col">
                <Card hoverable cover ={
                  <img src='https://photo.znews.vn/w660/Uploaded/ycgvppwi/2022_08_17/z3649757610090_a1488d39aae272b411f0ac77c027b61d.jpg' />
                } style={{width: 150}}></Card>
              </div>
            </div>
          ))}
        </div>
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

