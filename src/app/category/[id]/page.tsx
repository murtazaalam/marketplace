"use client";
import axios from 'axios';
import Header from '@/component/Header';
import Card from '@/component/Card';
import Footer from '@/component/Footer';
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';

export default function Category() {
  const pathname = usePathname();
  const [data, setData] = useState([] as any);

  useEffect(() => { getData() },[]);

  const getData = async() => {
    const id = localStorage.getItem("cat_id");
    await axios.get("http://localhost:5000/category/product/"+id)
    .then((response) => {
      response?.data?.statusCode === 200 && setData(response.data.data)
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const arrangedWord = () => {
    const name = pathname.split("/")[2];
    const result = name.replace(/-/g, " ").replace(/^./, (char) => char.toUpperCase());
    return result;
  }

  return (
    <div className="home-container">
      <Header />
      <div className='container-fluid min-vh-100'>
        <h2 className="heading">
          {arrangedWord()}
        </h2>
        {data && data.length > 0 && 
          data.map((item: any, index: number) => (
          <Card
            item={item}
            key={index}
          />
        ))}
      </div>
      <Footer />
    </div>
  )
}
