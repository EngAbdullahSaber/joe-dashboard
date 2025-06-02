"use client";
import { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hookRetaailers } from "@/hooks/retaailers/hookRetaailers";
import { Button } from '@/components/ui/button';
import {  Sheet,  SheetClose,  SheetContent,  SheetHeader,  SheetTitle,  SheetTrigger,} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import Filter from "./Filter";
import { FilterIcon } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";


interface FilterProps {
  table: Table<any>;
}

export function LayoutFilter ({ table }: FilterProps) {
  const {t} = useTranslate()


  return (

	<div  className="flex flex-col gap-[40px] " >

		<Sheet>
      
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="ltr:ml-2 rtl:mr-2  h-8 "> 
              <FilterIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />  {t("Filters")} 
          </Button>
          
        </SheetTrigger>

        <SheetContent className=" max-w-lg p-5 overflow-y-scroll " side={t("dir")} >
          <SheetHeader className="py-3 pl-3.5"> <SheetTitle> {t("Filter")} </SheetTitle> </SheetHeader> <hr />
          <div className="flex flex-col gap-4 "> 
            <Filter table={table}/> 
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
