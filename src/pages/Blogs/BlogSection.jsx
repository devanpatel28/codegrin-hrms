import { BLOGS } from "../../constants/BlogConstant";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/RoutesContants";

export default function BlogSection({ bloglimit = 4 }) {
      const navigate = useNavigate();
       const handleRedirect = (blog) => {
        navigate(`${ROUTES.BLOG_DETAILS}/${blog.slug}`);
    };
      
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 gap-6">
        {BLOGS.slice(0, bloglimit).map((blog, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row w-full h-full cursor-pointer hover:scale-101 bg-primary-card p-3 rounded-xl border border-transparent hover:border-primary transition-all duration-500 ease-in-out"
            onClick={() => handleRedirect(blog)}
          >
            <img
              src={blog.header_img}
              alt={blog.title}
              className="lg:h-70 md:h-60 md:w-1/3 object-cover rounded-xl"
            />
            <div className="w-full flex-1 min-h-20 mt-3 flex flex-col md:mr-5">
              <h3 className="text-xl font-semibold line-clamp-2 md:ml-5 lg:text-3xl">
                {blog.title}
              </h3>
                <p className="mt-5 text-secondary text-sm lg:text-lg leading-relaxed md:ml-7 line-clamp-4 lg:line-clamp-none md:text-justify">{blog.description}</p>
                <div className="flex items-center justify-between gap-2 md:mt-5">
                  <p className="mt-5 text-secondary text-sm lg:text-lg md:ml-7 md:mt-0">{blog.upload_date}</p>
                  <p className="mt-5 text-secondary text-sm lg:text-lg md:ml-7 md:mt-0">- {blog.publisher_name}</p>
                </div>
                
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
