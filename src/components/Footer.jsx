// src/components/Footer.jsx
import React from "react";
import { IMAGE_ASSETS } from "../constants/ImageContants";
import { ROUTES } from "../constants/RoutesContants";
import { Icon } from "@iconify/react/dist/iconify.js";
import { COMPANY_INFO } from "../constants/CompanyInfo";

// Social items config
const SOCIAL_ITEMS = [
  {
    key: "linkedin",
    href: COMPANY_INFO.LINKEDIN,
    icon: "ri:linkedin-fill",
    aria: "LinkedIn",
  },
  {
    key: "upwork",
    href: COMPANY_INFO.UPWORK,
    icon: "cib:upwork",
    aria: "Upwork",
  },
  {
    key: "instagram",
    href: COMPANY_INFO.INSTAGRAM,
    icon: "simple-icons:instagram",
    aria: "Instagram",
  },
  {
    key: "email",
    href: `mailto:${COMPANY_INFO.EMAIL}`,
    icon: "material-symbols:mail-outline-rounded",
    aria: "Email",
  },
];

export default function Footer() {
  return (
    <footer className="pt-10 mt-10 font-primary border-t border-white/20 section-space-sm-bottom relative text-white">
      <div className="section-space-md-bottom">
        <div className="container">
          <div className="grid gap-x-8 gap-y-6
                          grid-cols-2
                          md:grid-cols-2 md:grid-rows-2
                          lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:grid-rows-1"
          >
            {/* Company Info: mobile full width, md left-top, lg first column */}
            <div className="text-center md:text-left lg:text-left  pb-6 md:pb-0 col-span-2 md:col-span-1 lg:col-span-1">
              <a
                className="flex mb-5 justify-center md:justify-start lg:justify-start "
                href={ROUTES.HOME}
              >
                <img
                  src={IMAGE_ASSETS.LOGO}
                  alt="CodeGrin Logo"
                  className="w-1/2 lg:w-44"
                />
              </a>

              <p className="mb-5 text-sm text-white/75 lg:pr-6">
               CodeGrin Technologies building the future with next-gen AI strategies in Web Development, UI/UX, Blockchain, and Full Stack solutions.
              </p>

              <ul className="flex gap-3 justify-center md:justify-start lg:justify-start">
                {SOCIAL_ITEMS.map((item) => (
                  <li key={item.key}>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={item.href}
                      aria-label={item.aria}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full text-black bg-white transition"
                    >
                      <Icon icon={item.icon} width={20} height={20} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links: mobile left col, md top-right, lg 2nd column */}
            <div className="text-left pl-5 lg:pl-0 col-span-1 md:col-span-1 lg:col-span-1">
              <h6 className="text-lg font-semibold mb-3">Quick Links</h6>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href={ROUTES.HOME}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.SERVICES}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.COURSES}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.BLOG}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.ABOUT}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.CONTACT}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Support: mobile right col, md bottom-left, lg 3rd column */}
            <div className="text-left col-span-1 md:col-span-1 lg:col-span-1">
              <h6 className="text-lg font-semibold mb-3">Quick Support</h6>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href={ROUTES.FAQ}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    FAQ’s
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.TERMS}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.PRIVACY}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href={ROUTES.CONTACT}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Support Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacts: mobile full width, md bottom-right, lg 4th column */}
            <div className="mt-5 lg:mt-0 px-5 lg:px-0 text-left col-span-2 md:col-span-1 lg:col-span-1">
              <h6 className="text-lg font-semibold mb-3">Contacts</h6>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-3 items-start">
                  <Icon
                    icon="f7:location"
                    width={20}
                    height={20}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <a
                    href={COMPANY_INFO.ADDRESS_MAP}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/70 hover:text-primary"
                  >
                    {COMPANY_INFO.ADDRESS}
                  </a>
                </li>

                <li className="flex gap-3 items-start">
                  <Icon
                    icon="mage:phone-call"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <div className="flex flex-col gap-2">
                    {COMPANY_INFO.PHONE.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="text-sm text-white/70 hover:text-primary"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>

                <li className="flex gap-3 items-center">
                  <Icon
                    icon="material-symbols:mail-outline-rounded"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <a
                    href={`mailto:${COMPANY_INFO.EMAIL}`}
                    className="text-sm text-white/70 hover:text-primary"
                  >
                    {COMPANY_INFO.EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>{" "}
          {/* end outer grid */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-3 mt-5 border-t border-white/20">
        <div className="container">
          <p className="mb-10 text-sm text-white/70">
            {new Date().getFullYear()} &copy;{" "}
            <span className="text-primary">Codegrin Technologies</span> | All
            Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
