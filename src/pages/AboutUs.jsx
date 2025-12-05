import PageTitle from "../components/PageTitle";
import TeamCarousel from "../components/TeamCarousel";
import { TEAM_DATA } from "../constants/TeamConstant";
import TeamCard from "../components/Cards/TeamCard";

export default function Contact() {
  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle title="About Us" />
        <div className="my-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="w-full h-100 overflow-hidden blend-y-end">
            <TeamCarousel />
          </div>
          <div>
            <h1 className="text-4xl font-bold">We Are CODEGRIN</h1>
            <p className="mt-5 text-secondary text-justify">
              Founded in 2020, <strong>CodeGrin Technologies</strong> is a
              trusted partner for businesses looking to transform ideas into
              powerful digital solutions. We specialize in{" "}
              <strong> AI-driven and advanced frontend development</strong>,
              with deep expertise in the <strong> React ecosystem</strong>
              —including
              <strong> ReactJS, Next.js, Node.js</strong>, and more. By blending
              modern technology with a strong focus on
              <strong> User Experience (UX)</strong> and
              <strong> User Interface (UI)</strong> design, we create
              applications that are not only functional but also engaging and
              intuitive.
            </p>
            <p className="mt-5 text-secondary text-justify">
              From building <strong>custom web and mobile applications</strong>{" "}
              to enhancing existing platforms with cutting-edge features, our
              team delivers
              <strong> end-to-end solutions under one roof</strong>. At
              CodeGrin, we go beyond coding—we focus on crafting
              <strong> future-ready digital experiences</strong> that drive
              growth, scalability, and long-term success for our clients.
            </p>
          </div>
        </div>
        <div className="my-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold">Our Mission</h1>
            <p className="mt-5 text-secondary text-justify">
              Our mission is to enable businesses to unlock growth through
              modern digital solutions. By blending creativity with advanced
              technology, we design experiences that engage, inspire, and
              deliver results. We are committed to helping our clients stay
              ahead in a fast-changing digital world while shaping the future of
              interaction.
            </p>
            <h1 className="mt-10 text-4xl font-bold">Our Vission</h1>
            <p className="mt-5 text-secondary text-justify">
           We envision a world where businesses connect with their audiences through meaningful, intuitive, and powerful digital experiences. By blending design and technology, we aim to lead the transformation of the frontend industry and create solutions that leave a lasting impact.
            </p>
          </div>
          <div class="order-1 lg:order-2 animate-float-up relative w-60 h-52 md:w-[300px] md:h-[260px] flex items-center justify-center mx-auto">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 md:w-[150px] md:h-[150px] bg-blue-600 rotate-45 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span class="-rotate-45 text-xs md:text-sm tracking-widest">
                OUR
              </span>
            </div>

            <div class="absolute top-0 right-0 w-32 h-32 md:w-[150px] md:h-[150px] bg-orange-500 rotate-45 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span class="-rotate-45 text-xs md:text-sm tracking-widest">
                MISSION
              </span>
            </div>

            <div class="absolute bottom-0 right-0 w-32 h-32 md:w-[150px] md:h-[150px] bg-green-500 rotate-45 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span class="-rotate-45 text-xs md:text-sm tracking-widest">
                VISION
              </span>
            </div>
          </div>
        </div>
        <div className="mt-40 flex items-center justify-center">
          <div className="w-1/4 lg:w-full h-1 bg-primary blend-x" />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold w-2/3 text-center">
            Meet Our Team
          </h1>
          <div className="w-1/4 lg:w-full h-1 bg-primary blend-x" />
        </div>
        {/* Founder section - 2 items centered with gap-10 */}
        <div className="flex flex-col md:flex-row w-full items-center justify-center gap-6 md:gap-10 my-10 md:my-20">
          {TEAM_DATA.FOUNDER.map((item, index) => (
            <div key={index}>
              <TeamCard team={item} />
            </div>
          ))}
        </div>

        <div className="my-10 w-full h-0.5 bg-primary blend-x" />

        {/* Employee section - responsive grid with gap-x for md and below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-6 gap-10 my-10 sm:my-20 w-full justify-items-center">
          {TEAM_DATA.EMPLOYEES.map((item, index) => (
            <div key={index}>
              <TeamCard team={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
