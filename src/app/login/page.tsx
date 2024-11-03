"use client";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../assets/preloader.gif';

const data = {
    email: "",
    password: ""
}

export default function page() {
    const router = useRouter();
    const [formData, setFormData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: any) => {
        e.target.name === "email" && setFormData({...formData, email: e.target.value});
        e.target.name === "password" && setFormData({...formData, password: e.target.value});
    }

    const submitPressed = async() => {
        if(formValidity().isValid){
            setIsLoading(true);
            await axios.post("http://localhost:5000/login", formData)
            .then(response => {
                setIsLoading(false);
                if(response?.data?.statusCode === 200 ){
                    setFormData({email: "", password: ""});
                    toast.success("Login Successfully");
                    localStorage.setItem("user", JSON.stringify(response?.data?.data));
                    localStorage.setItem("token", response?.data?.token);
                    router.push("/");
                    return;
                }
                toast.error(response?.data?.message);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
                error.response && toast.error(error.response.data.message);
            })
            return;
        }
        toast.error(formValidity().message);
    }

    const formValidity = () => {
        const status = {isValid: true, message: ""};
        if(!formData.email || formData.email === ""){
            status.isValid = false;
            status.message = "Please enter email";
            return status;
        }
        if(!formData.password || formData.password === ""){
            status.isValid = false;
            status.message = "Please enter password";
            return status;
        }
        return status;
    }

    return (
        <div>
            <Header />
            <div className='container-fluid min-vh-100'>
                <div className='d-flex justify-content-center flex-column align-items-center vh-100'>
                    <h2 className="heading">
                        Login
                    </h2>
                    <div className="form-box">
                        <div>
                            <label className="form-label fw-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                className="form-control"
                                placeholder="Enter Email"
                                onChange={handleChange}
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                className="form-control"
                                onChange={handleChange}
                                placeholder="Enter Password"
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <button
                            type='button'
                            disabled={isLoading}
                            onClick={submitPressed}
                            className='btn btn-primary btn-app'
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
