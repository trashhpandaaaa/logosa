import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "@/components/common/PageHead";
import TripPlanner from "@/components/trip-planner/TripPlanner";

export const metadata: Metadata = {
  title: "Plan a journey",
  description:
    "Tell us how long you have, when you can travel and how hard you want to work, and see which of Logosa's routes across Nepal actually fit — then send the itinerary straight to us.",
  alternates: { canonical: "/plan" },
};

export default function PlanPage() {
  return (
    <>
      <PageHead
        kicker="Plan a journey"
        deva="यात्रा योजना"
        title={
          <>
            Four questions, then an <span className="italic">honest</span> answer.
          </>
        }
        standfirst="This builds an itinerary only from routes we actually run. If nothing fits the time you have, it says so rather than inventing something to fill the gap."
        breadcrumb={[{ href: "/", label: "Logosa" }]}
      />

      <Suspense fallback={<div className="h-[70vh] bg-paper" />}>
        <TripPlanner />
      </Suspense>
    </>
  );
}
