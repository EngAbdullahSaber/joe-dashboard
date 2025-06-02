import { ChevronsLeft, ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { useTranslate } from "@/config/useTranslation";

interface DataTablePaginationProps {
  table: Table<any>;
  setPage: (pageId: any) => void;
  page: number;
  data: any;
  isPaginationDisabled: boolean;
}

export function DataTablePagination({
  table,
  setPage,
  page,
  data,
  isPaginationDisabled,
}: DataTablePaginationProps) {
  const { t } = useTranslate();
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
        {table.getFilteredSelectedRowModel().rows.length} {t("of")}
        {table.getFilteredRowModel().rows.length} {t("row(s) selected")}
      </div>
      <div className="flex flex-wrap items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          {/* <p className="text-sm font-medium text-muted-foreground whitespace-nowrap"> {t("Rows per page")} </p> */}
          {/* <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
          {t("Page")} {page}
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button> */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => (page == 1 ? setPage(1) : setPage(page - 1))}
            disabled={page <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={isPaginationDisabled || data.length < 10}
            onClick={() => (page >= 1 ? setPage(page + 1) : setPage(page + 1))}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
