import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "@/components/common/PageHead";
import ExperienceFinder from "@/components/experiences/ExperienceFinder";
import EnquiryCta from "@/components/contact/EnquiryCta";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Trekking, culture, adventure, wildlife, pilgrimage, leisure, food and photography — choose what you are actually travelling for and see which parts of Nepal match.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHead
        kicker="Experiences"
        deva="अनुभव"
        title={
          <>
            Start from what you <span className="italic">want</span>, not from a map.
          </>
        }
        standfirst="Most people arrive knowing how they want to travel long before they know where. Choose as many as apply and the country rearranges itself around the answer."
      />

      <Suspense fallback={<div className="h-[60vh] bg-ink-deep" />}>
        <ExperienceFinder />
      </Suspense>

      <EnquiryCta
        heading="Or just describe it to us."
        note="Some trips do not fit a category. Tell us in plain words what you want out of a fortnight in Nepal and we will tell you what is possible."
      />
    </>
  );
}
