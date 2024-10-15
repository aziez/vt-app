"use client";
import TourEditor from "@/pages/editor/TourEditor";
import { useParams } from "next/navigation";

export default function TourPage() {
  const params = useParams();
  const tourId = params?.id as string | undefined;

  if (!tourId) {
    return <div>Tour ID not found.</div>;
  }

  return (
    <div className="min-h-screen">
      <TourEditor tourId={tourId} />
    </div>
  );
}
