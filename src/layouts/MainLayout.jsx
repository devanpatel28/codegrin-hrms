// import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ScrollRotatorButton from "../components/ScrollRotatorButton";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
export default function MainLayout() {
  return (
    <>
      <div className="bg-black text-white font-primary min-h-screen flex flex-col">
        <Header overlay />
        <CustomCursor />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
        <ScrollRotatorButton />
      </div>
    </>
  );
}
