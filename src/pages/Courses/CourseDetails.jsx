import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { ROUTES } from "../../constants/RoutesContants";
import { Icon } from "@iconify/react/dist/iconify.js";
import { COURSES } from "../../constants/CoursesConstants";
const CourseDetails = () => {
  
  const [course, setCourse] = React.useState(null);
  const { slug } = useParams();
  const [loading, setLoading] = React.useState(true);

    // Fetch portfolio data based on slug
    useEffect(() => {
      if (slug) {
        const foundCourse = COURSES.find(p => p.slug === slug);
        
        if (foundCourse) {
          setCourse(foundCourse);
        }
        setLoading(false);
      }
    }, [slug]);

    if (loading) {
      return (
        <div className="w-full flex justify-center items-center min-h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }
  if (!course) {
    return <Navigate to={ROUTES.COURSES} replace />;
  }
  return (
    <div className="container">
      <PageTitle title={course.title} showBreadcrumb={true} />

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 mt-20 mb-5 lg:mb-10">
        <div className="w-full col-span-2">
          <div className="font-bold text-4xl">Course Description</div>
          <p className="text-secondary mt-5 text-justify text-base">
            {course.description}
          </p>

          <div className="font-bold text-4xl mt-10">What You will Learn?</div>
          <ul className="list-none mt-5 text-secondary text-base">
            {course.what_you_will_learn.map((item, index) => (
              <li key={index} className="flex items-center gap-2 mb-2">
                {" "}
                <Icon
                  icon="material-symbols:verified-outline-rounded"
                  className="w-5 h-5"
                />{" "}
                {item}
              </li>
            ))}
          </ul>
          <p className="text-secondary text-base text-justify mt-10">
            At Codegrin Technologies, we are committed to helping individuals
            build a successful career in the ever-evolving tech industry.
            Through our expertly designed courses, we provide in-depth knowledge
            and practical experience in key areas of web and software
            development. Our instructors, with years of hands-on industry
            experience, guide you through the latest technologies and best
            practices, ensuring that you are equipped with the skills needed to
            excel. With flexible learning options and personalized career
            support, we help you transform your passion into a thriving career.
            Join Codegrin Technologies today and take the first step towards
            mastering the skills that will define the future of technology.
          </p>
        </div>

        <div className="w-full mt-10 lg:px-5 lg:mt-0">
            <div className="w-full border rounded-lg bg-primary-card border-primary-border">

                <img src={course.image} alt="" className="w-full rounded-t-lg object-cover" />
                <div className="px-5 mt-5">
                   <div className="flex items-center justify-between border-b-2 border-primary-border pb-3">
                    <div className="flex items-center gap-2 text-lg"><Icon icon="entypo:time-slot" className="w-5 h-5"/> Duration</div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary">{course.duration}</div>
                   </div>
                </div>
                <div className="px-5 mt-3">
                   <div className="flex items-center justify-between border-b-2 border-primary-border pb-3">
                    <div className="flex items-center gap-2 text-base lg:text-lg"><Icon icon="mingcute:document-line" className="w-5 h-5"/> Lesson</div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary">{course.lesson}+</div>
                   </div>
                </div>
                <div className="px-5 mt-3">
                   <div className="flex items-center justify-between border-b-2 border-primary-border pb-3">
                    <div className="flex items-center gap-2 text-base lg:text-lg"><Icon icon="mingcute:time-duration-line" className="w-5 h-5"/> Timings</div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary">{course.timing}</div>
                   </div>
                </div>
                <div className="px-5 mt-3">
                   <div className="flex items-center justify-between border-b-2 border-primary-border pb-3">
                    <div className="flex items-center gap-2 text-base lg:text-lg"><Icon icon="uil:language" className="w-5 h-5"/> Language
                    </div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary">{course.language}</div>
                   </div>
                </div>
                <div className="px-5 mt-3">
                   <div className="flex items-center justify-between border-b-2 border-primary-border pb-3">
                    <div className="flex items-center gap-2 text-base lg:text-lg"><Icon icon="icon-park-outline:degree-hat" className="w-5 h-5"/> Qualifications</div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary">{course.qualifications}</div>
                   </div>
                </div>
                <div className="px-5 mt-3">
                   <div className="flex items-center justify-between border-b-2 border-primary-border pb-3">
                    <div className="flex items-center gap-2 text-base lg:text-lg"><Icon icon="mdi:school-online" className="w-5 h-5"/> Learning Mode</div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary capitalize">{course.mode}</div>
                   </div>
                </div>
                <div className="px-5 mt-3">
                   <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2 text-base lg:text-lg"><Icon icon="ph:certificate" className="w-5 h-5"/> Certificate</div>
                    <div className="flex items-center gap-2 text-base lg:text-lg text-secondary">{course.certificate}</div>
                   </div>
                </div>
                <div className="px-5 py-7 mt-5">
                  <a href={ROUTES.CONTACT} className="px-5 py-3 font-semibold bg-primary text-white rounded-lg">Enroll Now</a>
                </div>   
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
