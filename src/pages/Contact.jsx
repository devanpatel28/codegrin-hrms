import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { COMPANY_INFO } from "../constants/CompanyInfo";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Contact() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult("");

    const formData = new FormData(event.target);
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
    formData.append('from_name', 'Inquiry - CodeGrin Technologies')
    formData.append('subject', event.target.subject.value)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully! We'll get back to you soon.");
        setError("");
        event.target.reset();
      } else {
        console.log("Error", data);
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle title="Contact Us" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center my-20">
          <div>
            <h1 className="lg:text-5xl text-3xl font-semibold">
              Opportunities Start With a Conversation 
            </h1>
            <p className="mt-5 text-secondary">
              Whether it’s services or collaborations, we’re here to support you every step of the way.{" "}
            </p>
            <div className="w-full h-0.5 bg-primary-card-light my-10" />
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-2xl font-semibold">Address</h2>
                <p className="mt-3 ml-3 text-secondary">
                  {COMPANY_INFO.ADDRESS}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Email</h2>
                <p className="mt-3 ml-3 text-secondary">{COMPANY_INFO.EMAIL}</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Phone</h2>
                <p className="mt-3 ml-3 text-secondary">
                  {COMPANY_INFO.PHONE.map((phone, index) => (
                    <div key={index}>{phone}</div>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary-card border border-primary-border rounded-xl">
            <h2 className="text-3xl font-semibold">
              Fill out the form and we will contact you
            </h2>
            
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-5 mt-10">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter full name"
                    className="p-3 bg-transparent border border-primary-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    className="p-3 bg-transparent border border-primary-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="Enter subject"
                    required
                    className="p-3 bg-transparent border border-primary-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Enter message"
                    className="p-3 bg-transparent border border-primary-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-vertical"
                    rows={5}
                    required
                  ></textarea>
                </div>
                
                {/* Error Message Above Button */}
                {error && (
                  <div className="p-3 flex items-center gap-2 rounded-lg bg-red-800 text-white">
                    <div className="flex items-center gap-2">
                      <Icon icon="line-md:close" className="w-5 h-5"/>
                      {error}
                    </div>
                  </div>
                )}
                {/* Success Message */}
            {result && (
              <div className="p-3 flex items-center gap-2 rounded-lg bg-green-800 text-white">
                <Icon icon="line-md:check-all" className="w-5 h-5"/>
                {result}
              </div>
            )}
                
                
                {/* Submit Button with Loading Animation */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 py-3 px-8 bg-primary border border-primary-border rounded-lg w-fit transition-all duration-200 ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:bg-primary-dark hover:shadow-md cursor-pointer'
                  }`}
                >
                  {/* Loading Spinner */}
                  {isSubmitting && (
                    <svg 
                      className="animate-spin h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  
                  {/* Button Text */}
                  <span>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Maps */}
        <div className="w-full h-1/2 bg-primary-card border border-primary-border rounded-2xl mb-20">
          <iframe
            src={COMPANY_INFO.ADDRESS_MAP_IFRAME}
            width="100%"
            height="600px"
            className="rounded-2xl dark:[filter:invert(100%)_contrast(100%)_hue-rotate(180deg)]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
