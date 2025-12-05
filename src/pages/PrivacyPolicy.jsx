import ArrowList from "../components/ArrowList";
import PageTitle from "../components/PageTitle";

export default function PrivacyPolicy() {
  return (
    <section className="w-full min-h-screen">
      <div className="container">
        <PageTitle title="Privacy Policy" />
        <h1 className="lg:text-3xl text-2xl font-bold mt-20">Introduction</h1>
        <p className="text-secondary text-base mt-3 text-justify">
          At Codegrin Technologies, your privacy is our top priority. This
          Privacy Policy outlines how we collect, use, and safeguard your
          information when you interact with our services.
        </p>

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">
          Information We Collect
        </h1>
        <p className="text-secondary text-base mt-3 text-justify">
          We may collect the following types of information from our clients:
        </p>
        <ArrowList
          items={[
            "Personal information such as name, email address, phone number, and business details.",
            "Project-related information, including specifications, data files, and other details required for service delivery.",
            "Website usage data, including IP address, browser type, and interaction details, to improve our services.",
            "Feedback and Reviews: Any feedback or reviews provided by the client.",
          ]}
        />

        <h1 className="lg:text-3xl text-2xl font-bold mt-15">
          How We Use Your Information
        </h1>
        <p className="text-secondary text-base mt-3 text-justify">
          The information we collect is used for the following purposes:
        </p>
        <ArrowList
          items={[
            "To deliver and manage the services you request.",
            "To improve our website, services, and user experience.",
            "To communicate with you about your projects and provide updates.",
            "To ensure compliance with legal obligations.",
          ]}
        />

        {/* Data Protection and Security Section */}
<div>
  <h1 className="lg:text-3xl text-2xl font-bold mt-15">
    Data Protection and Security
  </h1>
  <p className="text-secondary text-base mt-3 text-justify">
    We implement strict measures to protect your information from unauthorised access, disclosure, alteration, or destruction. These include:
  </p>
  <ArrowList
    items={[
      "Encryption of sensitive data.",
      "Secure storage of project files and personal information.",
      "Regular audits of our security practices.",
    ]}
  />
  <p className="text-secondary text-base mt-3 text-justify">
    While we strive to protect your information, no method of electronic transmission or storage is completely secure. Therefore, we cannot guarantee absolute security.
  </p>
</div>

{/* Sharing of Information Section */}
<div>
  <h1 className="lg:text-3xl text-2xl font-bold mt-15">
    Sharing of Information
  </h1>
  <p className="text-secondary text-base mt-3 text-justify">
    We do not sell, rent, or trade your personal information to third parties. However, we may share your information in the following circumstances:
  </p>
  <ArrowList
    items={[
      "With your explicit consent.",
      "To comply with legal obligations, such as responding to court orders or regulatory requests.",
      "With trusted third-party service providers who assist us in delivering our services, under strict confidentiality agreements.",
    ]}
  />
</div>

{/* Your Rights Section */}
<div>
  <h1 className="lg:text-3xl text-2xl font-bold mt-15">
    Your Rights
  </h1>
  <p className="text-secondary text-base mt-3 text-justify">
    You have the following rights regarding your personal information:
  </p>
  <ArrowList
    items={[
      "Access: You can request access to the personal information we hold about you.",
      "Correction: You can request corrections to any inaccurate or incomplete information.",
      "Deletion: You can request the deletion of your personal information, subject to legal or contractual obligations.",
      "Withdrawal of Consent: You can withdraw consent for data processing where applicable.",
    ]}
  />
</div>

{/* Changes to Privacy Policy Section */}
<div>
  <h1 className="lg:text-3xl text-2xl font-bold mt-15">
    Changes to This Privacy Policy
  </h1>
  <p className="text-secondary text-base mt-3 text-justify">
    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Updates will be communicated via email or our website. We encourage you to review this policy periodically.
  </p>
</div>

      </div>

      
    </section>
  );
}
