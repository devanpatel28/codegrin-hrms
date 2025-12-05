import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";

export default function ServiceCard(props) {
  const navigate = useNavigate();

  const handleRedirect = (service) => {
    navigate(`${ROUTES.SERVICE_DETAILS}/${service.slug}`);
  };

  return (
    <div
      className={`cursor-pointer relative group h-full flex flex-col text-white border-t md:border-t-0 md:border-l border-primary-border hover:border-primary-border transition-all duration-500 ease-in-out`}
      onClick={() => handleRedirect(props.service)}
    >
      {/* Rest of your component remains the same */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"></div>
      
      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-all duration-500 ease-out"></div>
      
      <span className="absolute -top-1 -left-1 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 z-10 transition-all ease-out"></span>
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 z-10 transition-all ease-out"></span>
      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 z-10 transition-all ease-out"></span>
      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 z-10 transition-all ease-out"></span>
      
      <div className="flex items-center p-6 sm:p-8 pb-0 h-20 relative z-10">
        <img
          src={props.service.img}
          className="h-12 w-auto object-contain mt-5 transition-all ease-out group-hover:brightness-110 group-hover:-translate-y-1 group-hover:drop-shadow-lg"
          alt=""
        />
      </div>
      
      <div className="px-6 sm:px-8 py-4 min-h-[4rem] flex items-start relative z-10">
        <h3 className="text-xl text-white font-bold leading-tight transition-all duration-400 ease-out transform">
          {props.service.title}
        </h3>
      </div>
      
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex-grow relative z-10">
        <p className="text-md text-secondary group-hover:text-white leading-tight transition-all duration-500 delay-100 ease-out group-hover:opacity-100">
          {props.service.short_description}
        </p>
      </div>
    </div>
  );
}
