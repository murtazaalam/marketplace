"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Footer from '@/component/Footer';
import Header from '@/component/Header';
import Loader from '../../assets/preloader.gif';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const data = {
  title: ""
}

export default function page() {
  const router = useRouter();
  const [formData, setFormData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    e.target.name === "name" && setFormData({title: e.target.value});
  }

  const submitPressed = async() => {
    if(!formData.title || formData.title === ""){
      toast.error("Category Name Required");
      return;
    }
    await axios.post("http://localhost:5000/category", formData,
      {
        headers: { token: localStorage.getItem("token") },
      }
    )
    .then(response => {
      if(response?.data?.statusCode === 200 ){
        setFormData({title: ""});
        toast.success("Category Added Successfully");
        return;
      }
      response.data.message && toast.error(response.data.message);
    })
    .catch(error => {
      console.log(error)
      if(error.response.data.message === "Session Expired"){
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      }
      error.response && toast.error(error.response.data.message);
    })
  }

  return (
    <div>
      <Header />
      <div className='container-fluid min-vh-100'>
        <div className='d-flex justify-content-center flex-column align-items-center vh-100'>
          <h2 className="heading">
            Add New Category
          </h2>
          <div className="form-box">
            <div>
              <label className="form-label fw-bold">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.title}
                className="form-control"
                placeholder="Enter Name"
                onChange={handleChange}
                aria-describedby="passwordHelpInline"
              />
            </div>
            <button
                type='button'
                onClick={submitPressed}
                className='btn btn-primary'
            >
              {isLoading ?
                <Image
                  width={24}
                  height={24}
                  src={Loader}
                  alt="Loader"
                />
                :
                "Submit"
              }
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
