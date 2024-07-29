import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ExplorationDashboard from "@/components/ExplorationDashboard/ExplorationDashboard";

export const metadata: Metadata = {
  title:
    "Next.js Exploration Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Exploration page for NextAdmin Dashboard Kit",
};

const Explore = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Explore" />
        <ExplorationDashboard />
      </div>
    </DefaultLayout>
  );
};

export default Explore;
