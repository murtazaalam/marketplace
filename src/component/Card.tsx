import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import consulty_univ from '../assets/consulty_univ.png';

export default function Card({item}: any) {

    return (
        <Link
            onClick={() => localStorage.setItem("prod_id", item.product_id)}
            href={`/product/${item?.product_name?.toLowerCase()?.replace(/ /g, "-")}`}
        >
            <div className="product-card">
                <div>
                    <div className='w-100'>
                        <div className='card-image'>
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
                        <div className='card-content'>
                            <h4 className="card-heading">{item.product_name}</h4>
                            <p className="card-sub-heading">{item.sub_title}</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="card-price">
                                    <i className="bi bi-currency-euro"></i>
                                    {item.price}
                                </p>
                                <button
                                    className='btn btn-outline-primary'
                                    onClick={() => localStorage.setItem("prod_id", item.product_id)}
                                >
                                    View Detail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
