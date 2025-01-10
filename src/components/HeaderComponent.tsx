import handleAPI from '@/apis/handleAPI';
import { SubProductModel } from '@/models/Product';
import { authSelector, removeAuth } from '@/reduxs/reducers/authReducer'
import { addProduct, CartItemModel, cartSelector, removeProduct } from '@/reduxs/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import { Affix, Avatar, Badge, Button, Card, Divider, Drawer, Dropdown, List, Menu, Modal, Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useDebugValue, useEffect, useState } from 'react'
import { BiCart, BiPowerOff, BiTrash } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoAccessibility, IoHeadsetOutline, IoHeartHalfOutline, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux'

const HeaderComponent = () => {
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const cart: CartItemModel[] = useSelector(cartSelector);
  // console.log(cart)

  useEffect(() => {
    cart.length > 0 && handleUpdateCartToDatabase(cart)
  }, [cart, auth])

  const handleUpdateCartToDatabase = async (data: CartItemModel[]) => {
    // console.log(data);
    data.forEach(async (item) => {

      const api = `/carts/add-cart${item._id ? `?id=${item._id}` : ''}`;
      const value = {
        createdBy: item.createdBy,
        count: item.count,
        subProductId: item.subProductId,
        size: item.size,
        color: item.color,
        price: item.price,
        qty: item.qty,
        productId: item.productId,
        image: item.image,
      }
      try {
        // console.log(value)
        // console.log(api);
        const res = await handleAPI({ url: api, data: value, method: 'post', })
        // console.log(res)
      } catch (error: any) {
        console.log(error);
      }
    })
  }

  const handleRemoveCartItem = async(item:any) =>{
    const api = `/carts/remove-cart?id=${item._id}`

    try {
      await handleAPI({url:api, data: undefined, method:'delete'})
      dispatch(removeProduct(item));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Affix offsetTop={0}>
      <div className="container-fluid bg-white">
        <div className='p-3'>
          <div className="row">
            <div className='d-block d-sm-block d-md-none'>
              <Button
                type='text'
                icon={<GiHamburgerMenu size={22} />}
                onClick={() => setIsVisibleDrawer(true)}
              />
            </div>
            <div className="col d-none d-md-block">
              <img src="https://phuongnamvina.com/img_data/images/logo-shop-quan-ao.jpg" style={{ width: '100px' }} alt="" />
            </div>
            <div className="col text-center d-none d-md-block">
              <Menu
                style={{ border: 'none' }}
                mode='horizontal'
                items={[
                  {
                    label: <Link href={'/'}>Home</Link>,
                    key: 'home',
                  },

                  {
                    label: <Link href={'/shop'}>Shop</Link>,
                    key: 'shop',
                    children: [
                      {
                        label: 'Category',
                        key: 'category',
                      }
                    ]
                  },

                  {
                    label: <Link href={'/'}>Our story</Link>,
                    key: 'story',
                  },

                  {
                    label: <Link href={'/'}>Blog</Link>,
                    key: 'blog',
                  },

                  {
                    label: <Link href={'/'}>Contact Us</Link>,
                    key: 'contact',
                  },
                ]} />
            </div>
            <div className="col text-right">
              {/* Nếu đã có tài khoản rồi thì sẽ vào trang đăng nhập còn chưa thì sẽ chuyển tới trang đăng nhập */}
              <Space>
                <Button icon={<IoSearch size={20} />} type='text' />
                <Button icon={<IoHeartHalfOutline size={20} />} type='text' />
                <Dropdown
                  dropdownRender={() => (
                    <Card className='shadow'
                      style={{ minWidth: 450 }}>
                      <Typography.Paragraph>
                        You have {cart.length} items in your cart
                      </Typography.Paragraph>

                      <List
                        dataSource={cart}
                        renderItem={(item) => (
                          <List.Item key={item._id}
                          extra={
                            <Button 
                            onClick={() => Modal.confirm({
                              title: 'Confirm to delete',
                              content: 'Are you want to delete',
                              onOk:async () => {
                                await handleRemoveCartItem(item);
                              }
                            })}
                            icon={<BiTrash size={20}/>}
                            danger
                            type='text'/>
                          }>
                            <List.Item.Meta
                              avatar={
                                <Avatar src={item.image}
                                  size={52}
                                  shape='square' />
                              }
                              title={
                                <>
                                  <Typography.Text 
                                  style={{
                                    fontWeight: 300,
                                    fontSize: '1rem'
                                  }}>
                                    fafa
                                  </Typography.Text>
                                  <Typography.Paragraph
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: '1.2rem',
                                      marginBottom: '0'
                                    }}>
                                    {item.count} x {VND.format(item.price)}
                                  </Typography.Paragraph>
                                </>
                              }

                              description={`Sizes: ${item.size}`}
                            />
                          </List.Item>

                        )} />

                      <Divider style={{ margin: '12px 0' }} />

                      <Typography.Title level={4}>Subtotal: {VND.format(cart.reduce((a,b) => a + b.count * b.price, 0))}</Typography.Title>

                      <div className="mt-4">
                        <Button className='mt-3'
                          onClick={() => { }}
                          type='primary'
                          ghost
                          size='large'
                          style={{ width: '100%' }}>
                          View Cart
                        </Button>

                        <Button className='mt-2'
                          onClick={() => { }}
                          type='primary'
                          ghost
                          size='large'
                          style={{ width: '100%', backgroundColor: 'black', color: 'white' }}>
                          Checkout
                        </Button>
                      </div>
                    </Card>
                  )}>
                  <Badge count={cart.length}>
                    <BiCart size={20} />
                  </Badge>
                </Dropdown>



                {auth.accesstoken && auth._id ? (
                  <Button onClick={() => {
                    dispatch(removeAuth({}))
                    localStorage.clear();
                  }}
                    danger type='text' icon={<BiPowerOff size={23} />}>
                  </Button>

                ) : (
                  <Button type='primary' onClick={() => router.push(`/auth/login`)} href={`/auth/login`}>Login</Button>
                )}
              </Space>

            </div>
          </div>
        </div>

        <Drawer
          open={isVisibleDrawer}
          onClick={() => setIsVisibleDrawer(false)}
          placement='left'>hello</Drawer>
      </div>

    </Affix>
  )
}

export default HeaderComponent
