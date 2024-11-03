"use client";
import axios from 'axios';
import Moment from "moment";
import Image from 'next/image';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import React, { useEffect, useState } from 'react';
import consulty_univ from '../../assets/consulty_univ.png';

export default function page() {
    const [user, setUser] = useState(null as any);
    const [order, setOrder] = useState(null as any);
    const [product, setProduct] = useState(null as any);

    useEffect(() => { setUser(JSON.parse(localStorage.getItem("user") as any)) }, []);

    useEffect(() => { getOrders() },[]);

    useEffect(() => { getProducts() },[]);

    const getOrders = async() => {
        await axios.get("http://localhost:5000/order",
            {
                headers: { token: localStorage.getItem("token") }
            }
        )
        .then(response => {
            setOrder(response.data.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const getProducts = async() => {
        await axios.get("http://localhost:5000/user/product",
            {
                headers: { token: localStorage.getItem("token") }
            }
        )
        .then(response => {
            setProduct(response.data.data)
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    return (
        <div>
            <Header />
            <div className='container-fluid min-vh-100'>
                <div className='publisher-detail user-detail'>
                    <div>
                        <div className='d-flex justify-center'>
                            <div className="user-2">
                                <i
                                    className="bi bi-person" 
                                    style={{
                                        color: '#fff', 
                                        fontSize: 40
                                    }}
                                >
                                </i>
                            </div>
                        </div>
                        <p>
                            <span>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>:
                            <span>
                                &nbsp;&nbsp;{user && user?.name}
                            </span>
                        </p>
                        <p>
                            <span>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>:
                            <span>
                                &nbsp;&nbsp;{user && user?.email}
                            </span>
                        </p>
                        <p>
                            <span>Phone Number&nbsp;&nbsp;</span>:
                            <span>
                                &nbsp;&nbsp;{user && user?.phone}
                            </span>
                        </p>
                    </div>
                </div>
                {order && order.length > 0 &&
                    <div>
                        <h2 className="product-name mb-3">Your Orders</h2>
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Sl.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Order Id</th>
                                    <th scope="col">Payment Id</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.product_name}</td>
                                        <td>
                                            <div className='p-image'>
                                                <Image
                                                    width={1000}
                                                    height={1000}
                                                    alt="cardImage"
                                                    src={item.image_link ?
                                                        `http://localhost:5000/images/${item.image_link}` :
                                                        consulty_univ
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <i className="bi bi-currency-euro"></i>
                                            {item.price}
                                        </td>
                                        <td>
                                            {item.order_id.split("_")[1]}
                                        </td>
                                        <td>
                                            {item.payment_id.split("_")[1]}
                                        </td>
                                        <td>
                                            {item.order_status === "Failed" && 
                                                <p
                                                    className="status" 
                                                    style={{backgroundColor: 'red'}}
                                                >
                                                    Failed
                                                </p>
                                            }
                                            {item.order_status === "Completed" && 
                                                <p
                                                    className="status" 
                                                    style={{backgroundColor: 'green'}}
                                                >
                                                    Completed
                                                </p>
                                            }
                                            {(item.order_status.toLowerCase() === "created" ||
                                                item.order_status.toLowerCase() === "pending") && 
                                                <p
                                                    className="status" 
                                                    style={{backgroundColor: 'yellow'}}
                                                >
                                                    Pending
                                                </p>
                                            }
                                        </td>
                                        <td>
                                            {Moment(item.updated_by).format('MMMM DD, YYYY')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                {product && product.length > 0 &&
                    <div>
                        <h2 className="product-name mb-3">Products added by you</h2>
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Sl.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className='p-image'>
                                                <Image
                                                    width={1000}
                                                    height={1000}
                                                    alt="cardImage"
                                                    src={item.image_link ?
                                                        `http://localhost:5000/images/${item.image_link}` :
                                                        consulty_univ
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <i className="bi bi-currency-euro"></i>
                                            {item.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <Footer />
        </div>
    )
}
