import React from "react";
import Image from "next/image";
import AppHome from "@/component/AppHome";
import Footer from "@/component/Footer";
import Header from "@/component/Header";

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <AppHome />
      <Footer />
    </div>
  );
}
