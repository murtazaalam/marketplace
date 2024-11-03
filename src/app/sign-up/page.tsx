"use client";
import axios from "axios";
import Image from "next/image";
import validator from "validator";
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { toast } from "react-toastify";
import Loader from '../../assets/preloader.gif';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const data = {
    name: "",
    email: "",
    phone: "",
    password: ""
}

export default function page() {
    const router = useRouter();
    const [formData, setFormData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [retypePassword, setRetypePassword] = useState("");

    const handleChange = (e: any) => {
        e.target.name === "name" && setFormData({...formData, name: e.target.value});
        e.target.name === "email" && setFormData({...formData, email: e.target.value});
        e.target.name === "phone" && setFormData({...formData, phone: e.target.value});
        e.target.name === "password" && setFormData({...formData, password: e.target.value});
        e.target.name === "rePassword" && setRetypePassword(e.target.value);
    }

    const submitPressed = async() => {
        if(formValidity().isValid){
            await axios.post("http://localhost:5000/register", formData)
            .then(response => {
                if(response?.data?.statusCode === 200 ){
                    setFormData({
                        ...formData,
                        name: "",
                        email: "",
                        phone: "",
                        password: ""
                    });
                    setRetypePassword("");
                    toast.success("User Registered Successfully");
                    router.push("/login");
                    return;
                }
                toast.error("Error While Registration");
            })
            .catch(error => {
                error.response && toast.error(error.response.data.message);
            })
            return;
        }
        toast.error(formValidity().message);
    }

    const formValidity = () => {
        const status = {isValid: true, message: ""};

        if(!formData.name || formData.name === ""){
            status.isValid = false;
            status.message = "Please enter name";
            return status;
        }
        if(!formData.email || formData.email === ""){
            status.isValid = false;
            status.message = "Please enter email";
            return status;
        }
        if(!validator.isEmail(formData.email)){
            status.isValid = false;
            status.message = "Invalid email entered";
            return status;
        }
        if(!formData.phone || formData.phone === ""){
            status.isValid = false;
            status.message = "Please enter phone number";
            return status;
        }
        if(formData.phone.length !== 9){
            status.isValid = false;
            status.message = "Invalid phone number entered";
            return status;
        }
        if(!formData.password || formData.password === ""){
            status.isValid = false;
            status.message = "Please enter password";
            return status;
        }
        if(formData.password.length < 9){
            status.isValid = false;
            status.message = "Password must be greater than 8 characters";
            return status;
        }
        if(formData.password !== retypePassword){
            status.isValid = false;
            status.message = "Password and re enter password must be same";
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
                        Sign Up
                    </h2>
                    <div className="form-box">
                        <div>
                            <label className="form-label fw-bold">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                className="form-control"
                                placeholder="Enter Name"
                                onChange={handleChange}
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <div className="mt-3">
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
                                Phone Number
                            </label>
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                className="form-control"
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                className="form-control"
                                onChange={handleChange}
                                placeholder="Enter Password"
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Re-Enter Password
                            </label>
                            <input
                                type="password"
                                name="rePassword"
                                value={retypePassword}
                                className="form-control"
                                onChange={handleChange}
                                placeholder="Re-Enter Password"
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
