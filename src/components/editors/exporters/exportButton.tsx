import { Tour } from "@/lib/types";
import { exportTour } from "@/utils/tourExporter";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ExportButton = ({ tour }: { tour: Tour | null }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = useCallback(async () => {
    if (!tour) {
      console.error("No tour data available for export");
      return null;
    }

    setIsLoading(true);
    try {
      await exportTour(tour);
      // Optionally: Show success notification to the user
    } catch (error) {
      console.error("Failed to export tour:", error);
      // Optionally: Show error notification to the user
    } finally {
      setIsLoading(false);
    }
  }, [tour]);

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      variant="default"
      className="absolute bottom-2 right-2"
    >
      {isLoading && (
        <Loader2 className="absolute left-3 h-5 w-5 animate-spin text-white" />
      )}
      {isLoading ? "Exporting..." : "Export Tour"}
    </Button>
  );
};

export default ExportButton;
