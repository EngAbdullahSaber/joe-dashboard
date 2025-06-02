"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/config/useTranslation";
const DashboardDropdown = () => {

  const {t} = useTranslate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="group h-6 w-6 bg-transparent hover:bg-transparent  text-default-800 border border-default-200"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[196px]"
        align="end"
        side="bottom"
        avoidCollisions
      >
        <DropdownMenuLabel> {t("View All")} </DropdownMenuLabel>
        <DropdownMenuItem> {t("Download")} </DropdownMenuItem>
        <DropdownMenuItem> {t("Refresh")} </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardDropdown;
