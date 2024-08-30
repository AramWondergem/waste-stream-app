import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Resource Finder page for waste streams app",
    description: "A page for finding waste information by resource type"
};

const ResourceFinder = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Resource Finder" />
        </DefaultLayout>
    );
};

export default ResourceFinder;