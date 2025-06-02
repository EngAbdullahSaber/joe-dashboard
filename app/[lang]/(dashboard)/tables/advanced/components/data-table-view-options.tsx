"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { translate } from "@/lib/utils";
import { getDictionary } from "@/app/dictionaries";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslate } from "@/config/useTranslation";

interface DataTableViewOptionsProps {
  table: Table<any>;
}

export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
  // const { lang } = useParams<{ lang: string | string[] }>();
  // const [trans, setTrans] = useState<any>(null); // Adjust the type as needed
  const {t} = useTranslate()


  // useEffect(() => {
  //   const fetchDictionary = async () => {
  //     let language: "en" | "ar" = "en"; // Default value

  //     if (Array.isArray(lang)) {
  //       const foundLang = lang.find((l) => l === "en" || l === "ar");
  //       if (foundLang) {
  //         language = foundLang as "en" | "ar"; // Type assertion
  //       }
  //     } else if (typeof lang === "string" && (lang === "en" || lang === "ar")) {
  //       language = lang as "en" | "ar"; // Type assertion
  //     } else {
  //       console.warn("Invalid language parameter: ", lang);
  //     }

  //     try {
  //       const dictionary = await getDictionary(language); // Fetch the dictionary
  //       setTrans(dictionary); // Set the fetched dictionary to state
  //     } catch (error) {
  //       console.error("Failed to fetch dictionary:", error);
  //     }
  //   };

  //   fetchDictionary(); // Call the async function
  // }, [lang]); // Dependency array, re-run if lang changes

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ltr:ml-2 rtl:mr-2  h-8 ">
          <SlidersHorizontal className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          {t("view")}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className=" min-w-[150px] w-full ">
        <DropdownMenuLabel>
          {t("toggle columns")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(column?.id?.toLocaleLowerCase())}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
