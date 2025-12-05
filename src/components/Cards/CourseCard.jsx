import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";

export default function CourseCard(props) {
  const navigate = useNavigate();

  const handleRedirect = (course) => {
    navigate(`${ROUTES.COURSE_DETAILS}/${course.slug}`);
  };
  
  return (
    <div
      className={`border w-full h-full flex flex-col rounded-xl group transition-all border-primary-border hover:border-primary bg-primary-card cursor-pointer`}
      onClick={() => handleRedirect(props.course)}
    >
      <div className="overflow-hidden w-full h-48 rounded-t-xl">
      <img
        src={props.course.image}
        alt={props.course.title}
        className="w-full h-full object-cover flex-shrink-0 group-hover:animate-float-up group-hover:scale-115 transition-all duration-500"
      />
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-sm bg-primary/30 w-fit px-2 py-1 rounded-full text-primary-light mb-4">
          # {props.course.category}
        </h2>
        <h2 className="text-xl font-semibold flex-1">{props.course.title}</h2>
      </div>
    </div>
  );
}
