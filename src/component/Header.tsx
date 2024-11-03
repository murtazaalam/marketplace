"use client";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState(null as any);
    
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user") as any));
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.success("Logged Out Successfully");
        router.push("/login");
        // router.push(router.asPath);
    }

    return (
        <nav className="navbar navbar-expand-lg bg-primary fixed-top" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Market Place</a>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarTogglerDemo02" 
                    aria-controls="navbarTogglerDemo02" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">
                                Marketplace
                            </a>
                        </li> */}
                    </ul>
                    {user ?
                        <div className="d-flex show-hide-dropdown">
                            <div className="user">
                                <i className="bi bi-person"></i>
                            </div>
                            <div className="user-dropdown">
                                <ul>
                                    <li className="text-center fw-bold">
                                        {user?.name}
                                    </li>
                                    <li>
                                        <Link href="/add-category">
                                            <i className="bi bi-diagram-2"></i>
                                            <span>Add Category</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/add-product">
                                            <i className="bi bi-backpack4"></i>
                                            <span>Add Product</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/cart">
                                            <i className="bi bi-bag-check"></i>
                                            <span>Cart</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/profile">
                                            <i className="bi bi-person"></i>
                                            <span>Profile</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" onClick={logout}>
                                            <i className="bi bi-box-arrow-right"></i>
                                            <span>Logout</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        :
                        <div className="d-flex">
                            <Link
                                href="/sign-up"
                                className="btn btn-gen"
                            >
                                Sign Up
                            </Link>
                            <Link
                                href="/login"
                                className="btn btn-gen ms-2"
                            >
                                Login
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
}
