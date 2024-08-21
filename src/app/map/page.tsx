import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Map Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Map page for NextAdmin Dashboard Kit",
};

const Map = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Map" />
      </div>
    </DefaultLayout>
  );
};

export default Map;
