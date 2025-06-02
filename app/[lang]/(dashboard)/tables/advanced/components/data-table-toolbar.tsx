"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getDictionary } from "@/app/dictionaries";
import { translate } from "@/lib/utils";
import { LayoutFilter } from "@/components/common/Filter/LayoutFilter";
import { useTranslate } from "@/config/useTranslation";

interface DataTableToolbarProps {
  table: Table<any>;
  setSearch?: (data: any) => void;
  search: string;
  setOpen?: any;
  open: any;
  searchPalsceholder: string;
}

export function DataTableToolbar({
  table,
  search,
  setOpen,
  open,
  searchPalsceholder,
  setSearch,
}: DataTableToolbarProps) {
  const { t } = useTranslate();

  return (
    <div className="flex flex-1 flex-wrap items-end justify-end gap-2">
      {searchPalsceholder ? (
        <Input
          placeholder={searchPalsceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 min-w-[200px] max-w-sm"
        />
      ) : (
        <div></div>
      )}
      <DataTableViewOptions table={table} />
      {/* <LayoutFilter
        onFilterChange={onFilterChange}
        filtersConfig={filtersConfig}
        setOpen={setOpen}
        open={open}
        onFilterSubmit={onFilterSubmit}
      /> */}
    </div>
  );
}
