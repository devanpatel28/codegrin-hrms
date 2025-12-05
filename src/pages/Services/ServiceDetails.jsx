import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { ROUTES } from "../../constants/RoutesContants";
import BorderButton from "../../components/Buttons/BorderButton";
import { SERVICES } from "../../constants/ServicesConstants";

const ServiceDetails = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) { // Changed from !slug to slug
      const foundService = SERVICES.find(s => s.slug === slug);
      
      if (foundService) {
        setService(foundService);
      }
      
      setLoading(false);
    }
  }, [slug]); // Removed 'service' from dependencies

  // Show loading while fetching service data
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If no service found, redirect to services page
  if (!service) {
    return <Navigate to={ROUTES.SERVICES} replace />;
  }

  return (
    <div className="container">
      <PageTitle title={service.title} showBreadcrumb={true} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 mt-10 mb-5 lg:mb-10">
        <div className="w-full text-justify lg:order-1 order-2">
          {service?.description?.map((desc, i) => (
            <li className="list-none mt-3 text-sm md:text-base text-secondary" key={i}>
              {desc}
            </li>
          ))}
          <BorderButton
            title="Inquiry Now"
            link={ROUTES.CONTACT}
            className="mt-10"
          />
        </div>
        <div className="w-full flex justify-center lg:order-2 order-1">
          <img
            src={service.img}
            alt={service.title}
            className="w-1/2 h-fit md:animate-float-down"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
