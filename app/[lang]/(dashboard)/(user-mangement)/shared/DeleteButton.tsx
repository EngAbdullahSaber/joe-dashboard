"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";

interface DeleteConfirmationDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  handleDelete: (id: any) => Promise<boolean>;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: string;
  triggerClassName?: string;
  id: any; // Add id prop
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  trigger,
  title,
  description,
  handleDelete,
  confirmButtonText = "Agree",
  cancelButtonText = "Disagree",
  icon = "wpf:delete-shield",
  triggerClassName = "",
  id, // Destructure id prop
}) => {
  const { t } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const success = await handleDelete(id);
      if (success) {
        setIsDialogOpen(false);
      }
    } catch (error) {
      reToast.error(t("Something went wrong. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="icon"
            variant="outline"
            className={`h-7 w-7 ${triggerClassName}`}
            color="secondary"
          >
            <Icon icon="heroicons:trash" className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-6 !h-auto" size="md">
        <div className="flex flex-col items-center text-center">
          <span className="text-8xl text-success">
            <Icon icon={icon} />
          </span>
          <h3 className="mt-6 mb-4 text-success text-xl font-semibold">
            {t(title)}
          </h3>
          <p className="text-sm text-default-500">{t(description)}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t(cancelButtonText)}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            color="warning"
            disabled={isLoading}
          >
            {isLoading ? t("Processing") : t(confirmButtonText)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
