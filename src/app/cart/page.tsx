"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '@/component/Footer';
import Header from '@/component/Header';
import useRazorpay from 'react-razorpay';
import consulty_univ from '../../assets/consulty_univ.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
    const router = useRouter();
    const [Razorpay] = useRazorpay();
    const [data, setData] = useState([] as any);
    const [user, setUser] = useState(null as any);

    useEffect(() => { setUser(JSON.parse(localStorage.getItem("user") as any)) }, []);

    useEffect(() => { getCartItem() }, []);

    const totalPrice = () => {
        let total = 0;
        total = data.reduce((total: number, item: any) => {
            return total + Math.round(item.price);
        }, 0)
        return total;
    }

    const getCartItem = async() => {
        await axios.get("http://localhost:5000/cart",
            {
                headers: { token: localStorage.getItem("token") }
            }
        )
        .then(response => {
            setData(response.data.data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const paymentInititated = async () => {
        await axios.post("http://localhost:5000/add-order",{},
            {
                headers: { token: localStorage.getItem("token") }
            }
        )
        .then(response => {
            if(response?.data?.statusCode === 200){
                const options = {
                    currency: "EUR",
                    name: "Market Place",
                    description: "Transaction",
                    image: "https://thriftyx-all-documents.s3.ap-south-1.amazonaws.com/rFiL1717326454920-logo.png",
                    order_id: response.data?.order_id,
                    modal: {
                        ondismiss: async function () {},
                    },
                    handler: async function (successRes: any) {
                        const verificationDetail = {
                            razorpay_payment_id: successRes.razorpay_payment_id,
                            order_id: response.data?.order_id,
                        };
                        await axios.post("http://localhost:5000/verify",
                            verificationDetail,
                            {
                                headers: { token: localStorage.getItem("token") }
                            }
                        )
                        .then(verifyRes => {
                            if(verifyRes?.data?.statusCode === 200) {
                                toast.success("Your order successful");
                                router.push("/");
                                return;
                            }
                            toast.error(verifyRes.data.message);
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: user?.phone,
                    },
                    notes: {
                        address: "Razorpay Corporate Office",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };
                const razorpay = new Razorpay(options as any);
                razorpay.on("payment.failed", async function (response: any) {
                    const verificationDetail = {
                        razorpay_payment_id: response?.error?.metadata?.payment_id,
                        order_id: response?.error?.metadata?.order_id,
                    };
                    await axios.post("http://localhost:5000/verify", verificationDetail,
                        {
                            headers: { token: localStorage.getItem("token") }
                        }
                    )
                    .then(response => {
                        toast.error("Payment Failed");
                    })
                    .catch(error => {
                        toast.error("Payment Failed");
                    })
                });
                razorpay.open();
                return;
            }
            toast.error(response.data.message);
        })
        .catch(error => {
            console.log(error);
            error.response && toast.error(error.response.data.message);
        })
    }

    return (
        <div className="home-container">
            <Header />
            <div className="container-fluid min-vh-100">
            <div className="product-container">
                {data && data?.length > 0 &&
                    <h2 className="product-name">Cart Items</h2>
                }
                <div className="mt-3">
                    {data && data?.length > 0 ?
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
                            {data && data.length > 0 && 
                                data.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.product_name}</td>
                                    <td>
                                        <div className='p-image'>
                                            <Image
                                                width={1000}
                                                height={1000}
                                                alt="cardImage"
                                                style={{borderRadius: 4}}
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
                            <tr>
                                <td colSpan={3} className="text-right fw-bold">
                                    Total
                                </td>
                                <td className="fw-bold">
                                    <i className="bi bi-currency-euro"></i>
                                    {totalPrice()}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="text-right">
                                    <button
                                        type='button'
                                        onClick={paymentInititated}
                                        className='btn btn-outline-success'
                                    >
                                        Pay Now
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    :
                    <div style={{height: '60vh'}} className="d-flex flex-column align-items-center justify-content-center">
                        <i className="bi bi-cart4" style={{fontSize: 80}}></i>
                        <h2 className="product-name text-center">
                            Cart Is Empty
                        </h2>
                        <Link
                            href="/"
                            className='btn btn-link'
                        >
                            Go To Home
                        </Link>
                    </div>
                    }
                </div>
            </div>
            </div>
            <Footer />
        </div>
    )
}
