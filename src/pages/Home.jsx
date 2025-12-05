import React from "react";
import { ROUTES } from "../constants/RoutesContants";
import Particles from "../components/Particles";
import { IMAGE_ASSETS } from "../constants/ImageContants";
import HeadingTitle from "../components/HeadingTItle";
import Orbit from "../components/Orbit";
import AchievementCard from "../components/Cards/AchievementCard";
import ServiceCard from "../components/Cards/ServiceCard";
import { SERVICES } from "../constants/ServicesConstants";
import BorderButton from "../components/Buttons/BorderButton";
import ToolsAnimation from "../components/ToolsAnimation";
import PortfolioCarousel from "./Portfolio/PortfolioCarousel";
import BlogSection from "./Blogs/BlogSection";
import ClientFeedbackAnimation from "../components/ClientFeedback";
import TeamCarousel from "../components/TeamCarousel";
export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="w-full h-auto blend-y-end overflow-x-clip">
        <div className="absolute w-full h-[130vh] top-0 -z-2">
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={2000}
            particleSpread={20}
            speed={0.05}
            particleBaseSize={60}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
            className="opacity-60"
          />
        </div>

        {/* <HeadingTitle
          word1={"Turning Ideas Into Impact"}
          word2={"Through the Power of Code"}
          className="lg:pt-50 md:pt-50 pt-50 pb-20"
          direction="col"
        /> */}
        <HeadingTitle
          word1={"Smarter, Faster, Future-Ready"}
          word2={"AI-Powered Digital Solutions"}
          className="lg:pt-50 md:pt-50 pt-50 pb-20"
          direction="col"
        />
        <Orbit
          planetCount={5}
          radius={{ base: "40%", md: "35%", lg: "27%" }}
          duration={20000}
          className="translate-y-45 md:translate-y-65 lg:translate-y-115"
        />
        <div className="relative flex w-full justify-center items-center pointer-events-none">
          <img
            src={IMAGE_ASSETS.HERO_SECTION_1}
            alt=""
            className="absolute  w-3/4 md:w-2/3 lg:w-1/2  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 animate-spin drop-shadow-[0_0_15px_cyan]  lg:drop-shadow-[0_0_20px_cyan]"
            style={{ animationDuration: "120s" }}
          />

          <img
            src={IMAGE_ASSETS.HERO_SECTION_2}
            alt=""
            className="relative mt-50 w-5/6 md:w-5/6 lg:max-w-300 z-10 animate-float-down"
          />
        </div>
      </section>

      {/* Contents */}
      <div className="container">
        {/* Achivement */}
        <section className="w-fullflex items-center justify-center">
          <HeadingTitle
            word1={"Our"}
            word2={"Achievements"}
            direction="row"
            className="mt-10 mb-5 lg:mb-10"
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 xl:gap-8 items-center justify-items-center">
            <AchievementCard
              className="animate-float-left lg:animate-float-left xl:animate-float-up"
              count={5}
              title={"Year of trust"}
            />
            <AchievementCard
              className="animate-float-right lg:animate-float-right xl:animate-float-down"
              count={29}
              title={"Clients"}
            />
            <AchievementCard
              className="animate-float-left lg:animate-float-right xl:animate-float-up"
              count={30}
              title={"Projects Completed"}
            />
            <AchievementCard
              className="animate-float-right lg:animate-float-left xl:animate-float-down"
              count={10}
              title={"Countries Served"}
            />
          </div>
        </section>

        {/* Services */}
        <section className="w-full flex flex-col items-center justify-center">
          <HeadingTitle
            word1={"Our"}
            word2={"Services"}
            direction="row"
            className="mt-20 mb-5 lg:mb-10"
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
            {SERVICES.slice(0, 8).map((service, index) => (
              <div key={index} className="w-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          <BorderButton
            title="View More"
            link={ROUTES.SERVICES}
            className="mt-10"
          />
        </section>

        {/* Tools */}
        <section>
          <HeadingTitle
            word1={"Building Smarter"}
            word2={"with AI & Top Tools"}
            direction="col"
            className="mt-20 mb-5 lg:mb-10"
          />
          <ToolsAnimation pauseOnHover={false} />
        </section>

        {/* Work */}
        <section className="w-full flex flex-col items-center justify-center">
          <HeadingTitle
            word1={"Built by"}
            word2={"CodeGrin"}
            direction="row"
            className="mt-20 mb-5 lg:mb-10"
          />
          <PortfolioCarousel />
          <BorderButton
            title="View More"
            link={ROUTES.PORTFOLIO}
            className="mt-10"
          />
        </section>

        {/* Blogs */}
        <section className="w-full flex flex-col items-center justify-center">
          <HeadingTitle
            word1={"From"}
            word2={"Our Desk"}
            direction="row"
            className="mt-20 mb-5 lg:mb-10"
          />
          <BlogSection bloglimit={4} />
          <BorderButton
            title="View More"
            link={ROUTES.BLOG}
            className="mt-10"
          />
        </section>

        {/* Client Feedback */}
        <section>
          <HeadingTitle
            word1={"Trusted by"}
            word2={"Our Clients"}
            direction="col"
            className="mt-30 mb-5 lg:mb-10"
          />
          <ClientFeedbackAnimation />
        </section>

        {/* Team */}
        <section>
          <HeadingTitle
            word1={"Brains"}
            word2={"Behind the Work"}
            direction="row"
            className="mt-30 mb-5 lg:mb-10"
          />
          <TeamCarousel />
        </section>

        {/* Why to choose us */}
        <section>
          <HeadingTitle
            word1={"Why Businesses"}
            word2={"Trust Codegrin"}
            direction="col"
            className="mt-30 mb-5 lg:mb-20"
          />
          <div className="text-justify text-base xl:text-lg text-secondary">
            <p className="mb-5">
              At <strong>Codegrin Technologies</strong>, we don’t just build
              software — we craft <strong>reliable digital solutions</strong>{" "}
              that create real business value. Since 2020, we’ve been helping
              companies turn ideas into
              <strong> scalable, future-ready products</strong> that drive
              growth. Our expertise covers the complete modern tech stack,
              including
              <strong> ReactJS, Next.js, Node.js</strong>, and more. From
              developing custom applications to upgrading existing systems and
              integrating the latest features, we provide{" "}
              <strong> end-to-end solutions you can trust</strong> — all under
              one roof.
            </p>

            <p className="mb-5">
              we believe technology should feel effortless. That’s why we design
              and build solutions that are
              <strong>intuitive, engaging, and built to last</strong>. Our
              strength lies in blending <strong> human-centered design</strong>{" "}
              with
              <strong> scalable engineering</strong>, so every product not only
              looks great but performs flawlessly in the real world. Whether
              it’s{" "}
              <strong>
                {" "}
                eCommerce, enterprise tools, or blockchain applications
              </strong>
              , we deliver solutions that adapt to business needs and create
              lasting impact across industries.
            </p>

            <p className="mb-5">
              we go beyond development by helping businesses scale through{" "}
              <strong> Google</strong> and <strong> Meta </strong>
              advertising. From driving targeted traffic to converting leads and
              boosting ROI, our marketing strategies are designed to deliver
              measurable growth.
            </p>
            <p className="mb-5">
              We see ourselves not just as a service provider, but as a
              <strong> strategic partner</strong> invested in your success.
              Guided by innovation and quality, our team ensures every project
              is delivered with precision—on time, on budget, and with results
              that consistently exceed expectations.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
