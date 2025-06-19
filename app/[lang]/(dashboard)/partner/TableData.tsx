"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslate } from "@/config/useTranslation";
import {
  DeletePartner,
  getPartner,
  getPartnerPanigation,
  SearchPartner,
} from "@/services/partner/partner";
import useDebounce from "../shared/useDebounce";
import DeleteConfirmationDialog from "../(user-mangement)/shared/DeleteButton";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import UpdatePartnerButton from "./UpdatePartnerButton";
import { ImageUrl } from "@/services/app.config";

interface Task {
  id: string;
  name?: any;
  logo_url?: any;
  website_url?: string;
  logo_alt?: string;
  created_at?: string;
}
interface TableDataProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const TableData = ({ flag, setFlag }: TableDataProps) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10); // Add page size state

  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "";

  const getData = async () => {
    setLoading(true);

    try {
      const res = await getPartner(lang);

      setData(
        res?.sections?.find((section: any) => section.id == "sec3").list || []
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };
  const SearchData = async () => {
    setLoading(true);

    try {
      const res = await SearchPartner(search, lang);

      setData(res?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, page, pageSize]);
  useEffect(() => {
    if (debouncedSearch) {
      SearchData();
    } else {
      getData();
    }
  }, [debouncedSearch, page, flag]);

  const handleDelete = async (paginatedIndex: number) => {
    try {
      // Calculate the actual index in the full dataset
      const actualIndex = (page - 1) * pageSize + paginatedIndex;

      const res = await DeletePartner(actualIndex, lang);

      if (res?.message) {
        const successMessage =
          typeof res.message === "string"
            ? res.message
            : lang === "en"
            ? res.message.english
            : res.message.arabic;

        reToast.success(successMessage);
      } else {
        reToast.success(t("Partner removed successfully"));
      }

      await getData();
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string | { english?: string; arabic?: string };
        error?: string;
      }>;

      let errorMessage = t("Removal failed");

      if (axiosError.response?.data) {
        const responseData = axiosError.response.data;

        if (typeof responseData.message === "string") {
          errorMessage = responseData.message;
        } else if (typeof responseData.message === "object") {
          errorMessage =
            lang === "en"
              ? responseData.message.english || errorMessage
              : responseData.message.arabic || errorMessage;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
      }

      reToast.error(errorMessage);
      return false;
    }
  };
  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="t-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="t-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <DeleteConfirmationDialog
            title={"Removing Partner"}
            description={"Are you sure you want to remove this partner?"}
            handleDelete={() => handleDelete(row.index)} // Pass the row index instead of id
            id={row.index.toString()}
          />
          {/* <UpdatePartnerButton
            flag={flag}
            setFlag={setFlag}
            partner={row.original}
          /> */}
        </div>
      ),
    },

    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"image"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Avatar>
              <AvatarImage src={`${ImageUrl}${row.original.url}`} />
              <AvatarFallback>image</AvatarFallback>
            </Avatar>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "image alternative description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"image alternative description"}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original?.alt}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];

  return (
    <div>
      {/* Render your data table here using the fetched tasks */}
      {/* Assuming you have a table component that takes columns and data */}
      <DataTable
        data={paginatedData} // Pass paginated data instead of full data
        setPage={setPage}
        setSearch={setSearch}
        searchPalsceholder={searchPalsceholder}
        page={page}
        open={open}
        setOpen={setOpen}
        search={search}
        columns={columns}
        isPaginationDisabled={data.length <= pageSize} // Disable if data fits on one page
      />{" "}
    </div>
  );
};

export default TableData;
