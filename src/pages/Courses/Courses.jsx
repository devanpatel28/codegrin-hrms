import PageTitle from "../../components/PageTitle";
import { COURSES } from "../../constants/CoursesConstants";
import CourseCard from "../../components/Cards/CourseCard";
export default function Courses() {
  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle title="Our Courses" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 my-20 ">
        {COURSES.map((course) => (
          <CourseCard course={course} />
        ))}
        </div>
      </div>
    </section>
  );
}
