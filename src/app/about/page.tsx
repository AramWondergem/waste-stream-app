import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js About Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js About page for NextAdmin Dashboard Kit",
};

const About = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="About" />
      </div>
    </DefaultLayout>
  );
};

export default About;
