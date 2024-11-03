
"use client";
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import Card from '../component/Card';
import React, { useState, useEffect } from 'react';
import consulty_univ from '../assets/consulty_univ.png';

export default function AppHome() {
    const [data, setData] = useState([] as any);
    const [products, setProducts] = useState([] as any);

    useEffect(() => { getAllCategory() },[]);

    useEffect(() => { getAllProducts() },[]);

    const getAllCategory = async() => {
        await axios.get("http://localhost:5000/category")
        .then(response => {
            response.data.statusCode === 200 && setData(response.data.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const getAllProducts = async() => {
        await axios.get("http://localhost:5000/product")
        .then(response => {
            response.data.statusCode === 200 && setProducts(response.data.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div className="container-fluid">
            <div className="min-vh-100">
                <div className="carousel-in">
                    <div 
                        id="carouselExample" 
                        className="carousel slide"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner">
                            {products && products?.length > 0 &&
                                products?.map((item: any, index: number) => (
                                item.image_link &&
                                <div
                                    key={index}
                                    data-bs-interval="2000"
                                    className={`carousel-item ${index === 0 && 'active'}`}
                                >
                                    <Link 
                                        onClick={() => localStorage.setItem("prod_id", item.id)}
                                        href={`/product/${item?.name?.toLowerCase()?.replace(/ /g, "-")}`}
                                    >
                                        <div className="layer"></div>
                                        <Image
                                            width="1000"
                                            height="1000"
                                            style={{borderRadius: 8}}
                                            src={`http://localhost:5000/images/${item.image_link}`}
                                            className="d-block w-100"
                                            alt="..."
                                        />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5>{item.name}</h5>
                                            <p>Some representative placeholder content for the first slide.</p>
                                        </div>
                                    </Link>
                                </div>
                                
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                {data && data.length > 0 && 
                data.map((item: any, index: number) => (
                    <div key={index}>
                        <div className="cat-div text-center">
                            <Link
                                className='heading'
                                onClick={() => localStorage.setItem("cat_id", item.category_id)}
                                href={`/category/${item?.category_name?.toLowerCase()?.replace(/ /g, "-")}`}
                            >
                                {item.category_name}
                            </Link>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div>
                                {item.products.map((it: any, ind: number) => (
                                    <Card
                                        item={it}
                                        index={ind}
                                        key={`${it.name}${ind}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
