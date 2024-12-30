import handleAPI from '@/apis/handleAPI'
import HeadComponents from '@/components/HeadComponents'
import HeaderComponent from '@/components/HeaderComponent'
import { appInfo } from '@/constants/appInfos'
import { PromotionModel } from '@/models/PromotionModels'
import { authSelector } from '@/reduxs/reducers/authReducer'
import { Button, Carousel, Typography } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsArrow90DegLeft, BsArrowRight } from 'react-icons/bs'
import { useSelector } from 'react-redux'

const { Title } = Typography;

const HomePage = (data: any) => {
  console.log('HIen thi data: ',data)

  const [promotions, setPromotions] = useState<PromotionModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector(authSelector);

  useEffect(() => {
    getData();
  }, [])

  // Nếu cảm thấy bị lặp nhiều (tryCatch) quá thì có thể tạo nó một biến riêng rồi dùng nhiều lần (Không pk viết lại nhiều)
  const getData = async () => {
    setIsLoading(true);

    try {
      await getCategories();
      await getPromotions();
    } catch (error: any) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getPromotions = async () => {
    const api = `/promotions/get-promotions`;

    const res = await handleAPI({ url: api });
    console.log(res);

    setPromotions(res.data.data);
  }

  const getCategories = async () => {
    const api = `/products/get-categories`;

    const res = await handleAPI({ url: api });
    console.log(res)
  }

  return (
    <>
      <HeadComponents title='BaoThanh Fashion' />

      <div className="container" style={{position: 'relative'}}>
        <Carousel
          style={{
            width: '100%',
            height: 500,
          }}
        >
          {promotions.map((item) => (
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
                  UP TO {item.value} {item.type === 'percent' ? '%' : ''}
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

export const getStaticProps = async() => {
  try {
    const promotions = await fetch(`${appInfo.logo}/`)
    return {
      props: {
        posts:[],
      },
    }
  } catch (error) {
    
  }
}
