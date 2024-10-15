import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TourDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tourTitle: string;
  setTourTitle: (title: string) => void;
  tourTemplate: string;
  setTourTemplate: (template: string) => void;
  onSubmit: () => void;
}

const TourDialog: React.FC<TourDialogProps> = ({
  isOpen,
  setIsOpen,
  tourTitle,
  setTourTitle,
  tourTemplate,
  setTourTemplate,
  onSubmit,
}) => {
  const handleTemplateChange = (value: string) => {
    setTourTemplate(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill Tour Information</DialogTitle>
          <DialogDescription>
            Please enter the required details to create your tour.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <Label htmlFor="tourTitle">Tour Title</Label>
          <Input
            id="tourTitle"
            value={tourTitle}
            onChange={(e) => setTourTitle(e.target.value)}
            placeholder="Enter tour title"
            className="mb-4"
          />

          <Label htmlFor="tourTemplate">Tour Template</Label>
          <Select onValueChange={handleTemplateChange} value={tourTemplate}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select tour template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Save Tour</Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TourDialog;
