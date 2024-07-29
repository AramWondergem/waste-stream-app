import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Download Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Download page for NextAdmin Dashboard Kit",
};

const Download = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Download Data" />

      </div>
    </DefaultLayout>
  );
};

export default Download;
