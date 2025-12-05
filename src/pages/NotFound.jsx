import React from "react";
import { IMAGE_ASSETS } from "../constants/ImageContants";
import BorderButton from "../components/Buttons/BorderButton";
import { ROUTES } from "../constants/RoutesContants";

export default function NotFound() {
  return (
    <section className="flex bg-black flex-col justify-center items-center h-screen gap-10">
      <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl animate-float-up">404 - PAGE NOT FOUND</h1>
      <img src={IMAGE_ASSETS.NOT_FOUND} className="w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/3  rounded-xl blend-y animate-float-down" alt=""/>
      <BorderButton title="GO BACK TO HOME" link={ROUTES.HOME} />
    </section>
  );
}
