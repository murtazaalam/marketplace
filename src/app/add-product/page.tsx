"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Footer from '@/component/Footer';
import Header from '@/component/Header';
import Loader from '../../assets/preloader.gif';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const data = {
    category_id: 1,
    name: "",
    description: "",
    price: 0,
    posted_by: "",
    sub_title: "",
    email: "",
    image_link: ""
}

export default function page() {
    const router = useRouter();
    const [formData, setFormData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [allCategory, setAllCategory] = useState([]);
    const [image, setImage] = useState();

    useEffect(() => { getAllCategory() },[])

    const getAllCategory = async() => {
        await axios("http://localhost:5000/category/all")
        .then(response =>{
            setAllCategory(response.data.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleChange = (e: any) => {
        e.target.name === "name" && setFormData({...formData, name: e.target.value});
        e.target.name === "category" && setFormData({...formData, category_id: e.target.value});
        e.target.name === "price" && setFormData({...formData, price: e.target.value});
        e.target.name === "sub_title" && setFormData({...formData, sub_title: e.target.value});
        e.target.name === "description" && setFormData({...formData, description: e.target.value});
        if(e.target.name === "image"){
            if(!e.target.files) return;
            if(e.target.files[0].type === "image/jpeg" ||
                e.target.files[0].type === "image/jpg" ||
                e.target.files[0].type === "image/png")
            {
                const formData = new FormData();
                formData.append('image', e.target.files[0]);
                axios.post("http://localhost:5000/upload", formData)
                .then(response => {
                    setImage(response.data.data)
                })
                .catch(err => {
                    console.log("hello====", err)
                })
                return;
            }
            toast.error("Invalid file type");
        }
    }

    const submitPressed = async() => {
        if(formValidity().isValid){
            const user = JSON.parse(localStorage.getItem("user") as any);
            const body = {
                category_id: formData.category_id,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                posted_by: user.name,
                created_date: new Date().toISOString(),
                sub_title: formData.sub_title,
                email: user.email,
                image_link: image
            }
            setIsLoading(true);
            await axios.post("http://localhost:5000/product", body,
                {
                    headers: { token: localStorage.getItem("token") },
                }
            )
            .then((response) => {
                setIsLoading(false);
                if(response?.data?.statusCode === 200 ){
                    setFormData({...data});
                    toast.success("Product Added Successfully");
                    router.push("/");
                    return;
                }
                response?.data?.message && toast.error(response?.data?.message);
            })
            .catch((error) => {
                console.log(error)
                if(error.response.data.message === "Session Expired"){
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }
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
            status.message = "Please enter product name";
            return status;
        }
        if(!formData.sub_title || formData.sub_title === ""){
            status.isValid = false;
            status.message = "Please enter subtitle";
            return status;
        }
        if(!formData.description || formData.description === ""){
            status.isValid = false;
            status.message = "Please enter description";
            return status;
        }
        if(!formData.price || formData.price === 0){
            status.isValid = false;
            status.message = "Please enter product price";
            return status;
        }
        if(!image || image === ""){
            status.isValid = false;
            status.message = "Please upload product image";
            return status;
        }
        return status;
    }

    return (
        <div>
            <Header />
            <div className='container-fluid min-vh-100 p-form'>
                <div className='d-flex justify-content-center flex-column align-items-center'>
                    <h2 className="heading">
                        Add New Product
                    </h2>
                    <div className="form-box">
                        <div>
                            <label className="form-label fw-bold">
                                Product Name
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
                                Sub Title
                            </label>
                            <input
                                type="text"
                                name="sub_title"
                                value={formData.sub_title}
                                className="form-control"
                                placeholder="Enter Sub Title"
                                onChange={handleChange}
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Product Category
                            </label>
                            <select
                                name="category"
                                value={formData.category_id}
                                className="form-select"
                                onChange={handleChange}
                            >
                                <option disabled>Open this select menu</option>
                                {allCategory && allCategory?.length > 0 &&
                                    allCategory.map((item: any, index) => (
                                        <option value={item.id} key={index}>
                                            {item.title}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                name="description"
                                className="form-control"
                                onChange={handleChange}
                                value={formData.description}
                                placeholder="Enter Description" 
                            ></textarea>
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                className="form-control"
                                onChange={handleChange}
                                placeholder="Enter Price"
                                aria-describedby="passwordHelpInline"
                            />
                        </div>
                        <div className="mt-3">
                            <label className="form-label fw-bold">
                                Product Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                // value={formData.image_link}
                                className="form-control"
                                onChange={handleChange}
                            />
                            {(image && image !== "") &&
                                <div className="product-img">
                                    <Image 
                                        height={1000}
                                        width={1000}
                                        alt="productImage"
                                        style={{borderRadius: 4}}
                                        src={'http://localhost:5000/images/'+image}
                                    />
                                </div>
                            }
                        </div>
                        <button
                            type='button'
                            disabled={isLoading}
                            onClick={submitPressed}
                            className='btn btn-primary d-flex justify-center'
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
