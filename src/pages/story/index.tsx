import handleAPI from '@/apis/handleAPI';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Carousel, Space, Skeleton, Rate } from 'antd';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { TabbarComponent } from '@/components';
import { ReviewModel } from '@/models/ReviewModel';
import { CarouselRef } from 'antd/es/carousel';
import HeadComponents from '@/components/HeadComponents';

const Story = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const catSlideRef = useRef<CarouselRef>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getTop54Star();
    }, []);

    const getTop54Star = async () => {
        const api = `/reviews/getTop5Start`;

        try {
            setIsLoading(true);
            const res = await handleAPI({ url: api, method: 'get' });
            console.log(res);
            setReviews(res.data.data);
        } catch (error: any) {
            console.log(error);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <HeadComponents title='Our story' />
        <div>
            <div>
                <TabbarComponent
                    title='Top Reviews'
                    right={
                        <Space className="custom-space">
                            <Button
                                size='large'
                                type='default'
                                icon={<BsArrowLeft size={18} />}
                                onClick={() => catSlideRef.current?.prev()}
                            />
                            <Button
                                size='large'
                                type='default'
                                icon={<BsArrowRight size={18} />}
                                onClick={() => catSlideRef.current?.next()}
                            />
                        </Space>
                    }
                />
                {isLoading ? (
                    <Skeleton active />
                ) : (
                    <Carousel className="custom-carousel" speed={1000} ref={catSlideRef} autoplay dots={false}>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="review-item">
                                    {/* Hiển thị bình luận */}
                                    <p className="comment">"{review.comment}"</p>

                                    {/* Hiển thị số sao */}
                                    <div className="stars">
                                        <Rate disabled defaultValue={review.star} />
                                    </div>

                                    {/* Người tạo đánh giá */}
                                    <p className="created-by">By: {review.createdBy}</p>

                                    {/* Hiển thị hình ảnh nếu có */}
                                    {review.images.length > 0 && (
                                        <div className="review-images">
                                            {review.images.map((img, index) => (
                                                <img key={index} src={img} alt="Review" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="review-item">No reviews available</div>
                        )}
                    </Carousel>
                )}
            </div>
        </div>
        </>
        
    );
};

export default Story;