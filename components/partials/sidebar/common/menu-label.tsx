import React from "react";
import { cn, translate } from "@/lib/utils";
import { useTranslate } from "@/config/useTranslation";

const MenuLabel = ({ item, className, trans }: {
  item: any,
  className?: string,
  trans: any
}) => {
  const { title } = item;

  const {t} =useTranslate()
  return (
    <div
      className={cn(
        "text-default-900 font-semibold uppercase mb-3 text-xs  mt-4",
        className
      )}
    >
      {t(title)}
    </div>
  );
};

export default MenuLabel;
