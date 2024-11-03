"use client";
import Image from 'next/image';
import axios from 'axios';
import Moment from "moment";
import Footer from '@/component/Footer';
import Header from '@/component/Header';
import React, { useState, useEffect } from 'react';
import consulty_univ from '../../../assets/consulty_univ.png';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Product() {
    const router = useRouter();
    const [data, setData] = useState({} as any);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { getProductById() },[]);

    const getProductById = async() => {
        const id = localStorage.getItem("prod_id");
        await axios.get("http://localhost:5000/product/"+id)
        .then((response) => {
            setData(response.data[0]);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const addToCart = async() => {
        const body = {
            product_id: data.id,
            product_name: data.name,
            image_link: data.image_link,
            price: data.price,
        }
        setIsLoading(true);
        await axios.post("http://localhost:5000/cart", body,
            {
                headers: { token: localStorage.getItem("token") },
            }
        )
        .then(response => {
            setIsLoading(false);
            if(response?.data?.statusCode === 200 ){
                toast.success("Product Added To Cart");
                return;
            }
            response?.data?.message && toast.error(response?.data?.message);
        })
        .catch(error => {
            console.log(error)
            if(error.response.data.message === "Session Expired"){
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                router.push("/login");
                return;
            }
            error.response && toast.error(error.response.data.message);
        })
    }

    return (
        <div className="home-container">
            <Header />
            <div className="container-fluid min-vh-100">
                <div className="product-container">
                    <div className="product-image">
                        <Image
                            width={2000}
                            height={2000}
                            alt="cardImage"
                            style={{borderRadius: 8}}
                            src={data?.image_link ?
                                `http://localhost:5000/images/${data?.image_link}` :
                                consulty_univ
                            }
                        />
                    </div>
                    <div>
                        <h2 className="product-name">
                            {data && data?.name}
                        </h2>
                        <p className="product-sub-heading">
                            {data && data?.sub_title}
                        </p>
                        <div className='d-flex align-items-center mt-3'>
                            <p className='product-price'>
                                <i className="bi bi-currency-euro"></i>
                                {data && data?.price}
                            </p>
                            <button 
                                onClick={addToCart}
                                className='btn btn-outline-success ms-2'
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>
                    <p className='product-description'>
                        {data && data?.description}
                    </p>
                    <div className='publisher-detail'>
                        <h3>Published By</h3>
                        <p>
                            <span>Name&nbsp;&nbsp;</span>:
                            <span>
                                &nbsp;&nbsp;{data && data?.posted_by}
                            </span>
                        </p>
                        <p>
                            <span>Email&nbsp;&nbsp;</span>:
                            <span>
                                &nbsp;&nbsp;{data && data?.email}
                            </span>
                        </p>
                        <p>
                            <span>Date&nbsp;&nbsp;&nbsp;&nbsp;</span>:
                            <span>
                                &nbsp;&nbsp;{data && Moment(data?.created_date).format('MMMM DD, YYYY')}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
