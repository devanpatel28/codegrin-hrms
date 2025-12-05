import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { ROUTES } from "../../constants/RoutesContants";
import { BLOGS } from "../../constants/BlogConstant";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundBlog = BLOGS.find(b => b.slug === slug);
      
      if (foundBlog) {
        setBlog(foundBlog);
        setLoading(false);
      }
    }
  }, [slug]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  if (!blog) {
    return <Navigate to={ROUTES.BLOG} replace />;
  }


  return (
    <div className="container">
      <PageTitle title={blog.title} showBreadcrumb={true} />
      <img 
        src={blog.blog_image} 
        alt={blog.title} 
        className="w-full h-full object-cover rounded-xl my-10"
      />
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.blog_content }}
      />
      <div className="flex justify-between items-center border-t border-primary mt-10 pt-5">
        <p className="text-gray-500">{blog.upload_date}</p>
        <p className="text-gray-500">- {blog.publisher_name}</p>
      </div>
    </div>
  );
}
