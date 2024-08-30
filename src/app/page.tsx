import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ExplorationDashboard from "@/components/ExplorationDashboard/ExplorationDashboard";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <title> Landing Page </title>
        <h1> Work in Progress </h1>
      </DefaultLayout>
    </>
  );
}
