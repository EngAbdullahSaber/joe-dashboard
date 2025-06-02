"use client"

import { useTranslate } from "@/config/useTranslation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const DashboardSelect = () => {
  const {t} = useTranslate()
  
  return (
    <Select>
      <SelectTrigger className="w-[124px]">
        <SelectValue placeholder={t("Select Date")} className="whitespace-nowrap" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="jan-12">Jan 12</SelectItem>
        <SelectItem value="jan-13">Jan 13</SelectItem>
        <SelectItem value="jan-14">Jan 14</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DashboardSelect;