"use client";

import TourEditor from "@/components/editors/TourEditor";
import { useParams } from "next/navigation";

export default function TourPage() {
  const params = useParams();
  const tourId = params.id as string;

  return (
    <div className="min-h-screen">
      <TourEditor tourId={tourId} />
    </div>
  );
}
