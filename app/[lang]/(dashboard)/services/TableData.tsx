"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslate } from "@/config/useTranslation";
import {
  DeleteServices,
  getServices,
  getServicesPanigation,
  SearchServices,
} from "@/services/service/service";
import useDebounce from "../shared/useDebounce";
import DeleteConfirmationDialog from "../(user-mangement)/shared/DeleteButton";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import UpdateDepartmentButton from "./UpdateOfferButton";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ViewMore from "./View";
import { baseUrl } from "@/services/app.config";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
interface Task {
  id: string;
  title?: any;
  subTitle?: any;
  image?: any;
  slug?: string;
  call?: any;
  faqs?: any;
  benefits?: any;
  partners?: any;
  meta?: any;
  impact?: any;
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
  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Search By Services Name ";

  const getData = async () => {
    setLoading(true);

    try {
      const res =
        page === 1
          ? await getServices(lang)
          : await getServicesPanigation(page, lang);

      setData(res?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };
  const SearchData = async () => {
    setLoading(true);

    try {
      const res = await SearchServices(search, lang);

      setData(res?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      SearchData();
    } else {
      getData();
    }
  }, [debouncedSearch, page, flag]);
  const handleDelete = async (id: any) => {
    try {
      const res = await DeleteServices(id, lang);

      if (res?.message) {
        const successMessage =
          typeof res.message === "string"
            ? res.message
            : lang === "en"
            ? res.message.english
            : res.message.arabic;

        reToast.success(successMessage);
      } else {
        reToast.success(t("Offer deleted successfully"));
      }
      await getData(); // Refresh data after successful deletion
      return true; // Indicate success
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string | { english?: string; arabic?: string };
        error?: string;
      }>;

      let errorMessage = t("Deletion failed");

      // Handle different error response formats
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
      return false; // Indicate failure
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
          <ViewMore row={row} />{" "}
          <DeleteConfirmationDialog
            title="Deleting Service"
            description="Are You Sure For Delete This Service?"
            handleDelete={handleDelete}
            id={row.original.id} // Pass the id directly
          />{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`services/${row.original.id}/page-meta`}>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                  >
                    {" "}
                    <Icon icon="iconoir:page" className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent color="primary">
                <p>{t("Update page Meta")}</p>
                <TooltipArrow className=" fill-primary" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
         
        
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`services/${row.original.id}/basic-info`}>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                  >
                    {" "}
                    <Icon icon="heroicons:pencil" className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent color="primary">
                <p>{t("Update Service")}</p>
                <TooltipArrow className=" fill-primary" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <UpdateDepartmentButton
            flag={flag}
            setFlag={setFlag}
            offer={row.original}
          /> */}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"id"} />
      ),
      cell: ({ row }) => (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          {row.original.id}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"title"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {lang == "en" ? row.original?.title.en : row.original?.title.ar}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "sub Title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"sub Title"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {lang == "en"
                ? row.original?.subTitle.en
                : row.original?.subTitle.ar}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
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
              <AvatarImage src={`${baseUrl}/${row.original.image?.url}`} />
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
      accessorKey: "Created At",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Created At"} />
      ),
      cell: ({ row }) => {
        const createdAt = row.original.created_at;

        // Check if created_at is valid before formatting the date
        const formattedDate = createdAt
          ? new Date(createdAt).toLocaleDateString("en-GB")
          : "N/A";

        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {formattedDate}
            </span>
          </div>
        );
      },
    },
  ];
  const isPaginationDisabled = data.length < 10 || data.length === 0;

  return (
    <div>
      {/* Render your data table here using the fetched tasks */}
      {/* Assuming you have a table component that takes columns and data */}
      <DataTable
        data={data}
        setPage={setPage}
        setSearch={setSearch}
        searchPalsceholder={searchPalsceholder}
        page={page}
        open={open}
        setOpen={setOpen}
        search={search}
        columns={columns}
        isPaginationDisabled={isPaginationDisabled}
      />{" "}
    </div>
  );
};

export default TableData;
