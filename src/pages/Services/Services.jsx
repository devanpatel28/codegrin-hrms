import ServiceCard from "../../components/Cards/ServiceCard";
import PageTitle from "../../components/PageTitle";
import { SERVICES } from "../../constants/ServicesConstants";
export default function Services() {


  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle
          title="Our Services"
        />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-20 mb-5 lg:mb-10">
          {SERVICES.map((service, index) => (
            <div key={index} className="w-full cursor-pointer">
              <ServiceCard service={service}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
