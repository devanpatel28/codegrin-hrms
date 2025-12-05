import { Icon } from "@iconify/react/dist/iconify.js";
import PageTitle from "../components/PageTitle";
import { ArrowList } from "../components/ArrowList";



export default function TermsConditions() {
  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle title="Terms & Conditions" />
        <h1 className="lg:text-3xl text-2xl font-bold mt-20">
          Introduction and Overview
        </h1>
        <p className="text-secondary text-base mt-3 text-justify">
          Welcome to Codegrin Technologies, a premier agency specialising in
          custom website creation, graphics and UI/UX design, blockchain
          solutions, and JavaScript-related frameworks. By engaging with our
          services, you agree to the terms and conditions outlined in this
          document. This document establishes clear expectations and
          responsibilities between Codegrin Technologies and the client.
        </p>

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">Refund Policy</h1>
        <p className="text-secondary text-base mt-3  text-justify">
          We are dedicated to delivering exceptional services to our clients.
          Refunds are governed by the following terms:
          <ArrowList items={[
            "Refunds are available only for milestones or deliverables that have not been met, subject to review.",
            "Refund requests must be submitted within 14 days of the payment date.",
            "Partial refunds may be provided based on the work completed prior to the request.",
            "Refunds are not applicable after final deliverables are approved.",
          ]} />
        </p>

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">Trial Policy</h1>
        <p className="text-secondary text-base mt-3  text-justify">
          We offer a complimentary trial service to showcase our expertise. The
          trial includes one task of limited scope, as determined by us. Complex
          or resource-intensive tasks are excluded from the trial. Trials are
          subject to availability and offered on a discretionary basis.
        </p>

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">Code Ownership</h1>
        <p className="text-secondary text-base mt-3  text-justify">
        All intellectual property created by Codegrin Technologies during the engagement is fully owned by the client upon completion of the project and full payment. This includes:
        </p>
        <ArrowList items={[
        "Codebases",
        "Graphics and UI/UX designs",
        "Blockchain solutions",
        "Any other deliverables",
         ]} />

<h1 className="lg:text-3xl text-2xl font-bold mt-15">Data Confidentiality and Security</h1>
        <p className="text-secondary text-base mt-3  text-justify">
        We are committed to maintaining the confidentiality and security of all client information, including but not limited to:
        </p>
        <ArrowList items={[
        "Login credentials",
        "Project data",
        "Proprietary business information"]} />
        <p className="text-secondary text-base mt-3  text-justify">
        We guarantee that data will never be shared with third parties without explicit client consent. All sensitive information is securely stored and managed. Clients have the right to grant or revoke our access at any time.
        </p>

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">Scope of Services</h1>
        <p className="text-secondary text-base mt-3  text-justify">
        At Codegrin Technologies, we specialise in the following services:
        </p>
        <ArrowList items={[
        "Custom Website Creation: Developing tailored websites to meet specific client needs, ensuring functionality, responsiveness, and aesthetic appeal.",
        "Graphics and UI/UX Design: Crafting user-centric designs and graphics for superior user experiences and branding consistency.",
        "Blockchain Design and Development: Designing and developing blockchain-based solutions, including smart contracts, decentralised applications, and token integrations. ",
        "JavaScript Framework Solutions: Expertise in JavaScript frameworks such as React.js, Vue.js, Node.js, and Angular.js for scalable and modern web applications."
        ]} />
        <p className="text-secondary text-base mt-3  text-justify">
        We guarantee that data will never be shared with third parties without explicit client consent. All sensitive information is securely stored and managed. Clients have the right to grant or revoke our access at any time.
        </p>

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">Project Timelines and Deliverables</h1>
        <ArrowList items={[
        "Project timelines will be defined in the initial agreement or proposal.",
        "Unforeseen delays will be communicated promptly.",
        "Revisions are limited to the scope outlined in the agreement. Additional changes beyond the defined scope may incur extra charges.",
        ]} />
        <p className="text-secondary text-base mt-3  text-justify">
        We guarantee that data will never be shared with third parties without explicit client consent. All sensitive information is securely stored and managed. Clients have the right to grant or revoke our access at any time.
        </p>


      </div>
    </section>
  );
}
