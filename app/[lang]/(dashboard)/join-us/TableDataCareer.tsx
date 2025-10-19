"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import useDebounce from "../shared/useDebounce";
import DeleteConfirmationDialog from "../(user-mangement)/shared/DeleteButton";
import ViewMore from "./View";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import GenericFilter from "@/components/common/Filter/GenericFilter";

import {
  DeleteContactUs,
  getContactUsCareer,
  getContactUsCareerPanigation,
  SearchContactUsCareer,
  getContactUsCareerWithFilters, // Add this API function
} from "@/services/contactUs/contactUs";

// Import the Cities and Positions data
import { Cities, Positions } from "./data";

interface Task {
  id: string;
  name?: any;
  email?: any;
  address?: any;
  phone?: any;
  offers_name?: any;
  created_at?: string;
  position?: string;
  city?: string;
}

interface ContactUsResponse {
  data: Task[];
  total_records?: number;
  current_page?: number;
  per_page?: number;
}

const TableDataCareer = () => {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();
  const debouncedSearch = useDebounce(search, 1000);
  const searchPalsceholder = "Search by name, email, or position...";

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  // Use the imported Cities and Positions data for filter options
  const cityOptions = [
    { label: "All Cities", value: "" },
    ...Cities.map((city) => ({
      label: lang === "ar" ? city.name_ar : city.name_en,
      value: city.value,
    })),
  ];

  const positionOptions = [
    { label: "All Positions", value: "" },
    ...Positions.map((position) => ({
      label: lang === "ar" ? position.name_ar : position.name_en,
      value: position.value,
    })),
  ];

  // Filter fields configuration with imported options
  const filterFields: any[] = [
    {
      name: "offers_name", // Changed from "position" to match API key
      label: "Position",
      type: "select",
      options: positionOptions,
      icon: "heroicons:briefcase",
    },
    {
      name: "address", // Changed from "city" to match API key
      label: "City",
      type: "select",
      options: cityOptions,
      icon: "heroicons:map-pin",
    },
  ];

  // Function to build API filter parameters
  const buildApiFilters = (filters: Record<string, any>) => {
    const apiFilters: Record<string, any> = {};

    if (filters.offers_name) {
      apiFilters.offers_name = filters.offers_name;
    }

    if (filters.address) {
      apiFilters.address = filters.address;
    }

    if (filters.date_range?.from && filters.date_range?.to) {
      apiFilters.start_date = filters.date_range.from;
      apiFilters.end_date = filters.date_range.to;
    }

    return apiFilters;
  };

  const handleFilterApply = async (newFilters: Record<string, any>) => {
    console.log("Applying filters:", newFilters);

    // Clean up empty filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "All" &&
          !(typeof value === "object" && Object.keys(value).length === 0)
      )
    );

    setFilters(cleanedFilters);
    setPage(1);

    // Fetch data with API filters
    await fetchDataWithApiFilters(cleanedFilters);

    // Show feedback to user
    if (Object.keys(cleanedFilters).length > 0) {
      reToast.success("Filters applied successfully!");
    } else {
      reToast.success("Showing all records!");
    }
  };

  const handleFilterReset = async () => {
    console.log("Resetting filters");
    setFilters({});
    setPage(1);
    await getData();
    reToast.success("Filters cleared!");
  };

  // New function to fetch data with API-side filtering
  const fetchDataWithApiFilters = async (
    appliedFilters: Record<string, any>
  ) => {
    setLoading(true);
    try {
      const apiFilters = buildApiFilters(appliedFilters);

      let res: ContactUsResponse;

      // If we have search term, use search API (you might need to modify this to include filters)
      if (search) {
        // If you need combined search + filters, you'll need a dedicated API endpoint
        res = await SearchContactUsCareer(search, lang);
        // Apply client-side filtering for search results if needed
        if (Object.keys(apiFilters).length > 0) {
          res.data = res.data.filter((item) => {
            return Object.entries(apiFilters).every(([key, value]) => {
              switch (key) {
                case "offers_name":
                  return item.offers_name === value;
                case "address":
                  return item.address === value;

                default:
                  return true;
              }
            });
          });
        }
      }
      // If we have API filters, use filtered API call
      else if (Object.keys(apiFilters).length > 0) {
        // You need to implement this API function
        res = await getContactUsCareerWithFilters(apiFilters, page, lang);
      }
      // Otherwise use regular pagination
      else if (page > 1) {
        res = await getContactUsCareerPanigation(page, lang);
      }
      // Otherwise use regular API
      else {
        res = await getContactUsCareer(lang);
      }

      setData(res?.data || []);
      setTotalRecords(res?.total_records || res?.data?.length || 0);
      setCurrentPage(res?.current_page || 1);
      setPerPage(res?.per_page || 10);
    } catch (error) {
      console.error("Error fetching filtered data", error);
      reToast.error("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res: ContactUsResponse =
        page === 1
          ? await getContactUsCareer(lang)
          : await getContactUsCareerPanigation(page, lang);

      setData(res?.data || []);
      setTotalRecords(res?.total_records || res?.data?.length || 0);
      setCurrentPage(res?.current_page || 1);
      setPerPage(res?.per_page || 10);
    } catch (error) {
      console.error("Error fetching data", error);
      reToast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const SearchData = async () => {
    setLoading(true);
    try {
      const res = await SearchContactUsCareer(search, lang);
      setData(res?.data || []);
      setTotalRecords(res?.total_records || res?.data?.length || 0);
    } catch (error) {
      console.error("Error searching data", error);
      reToast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      SearchData();
    } else if (Object.keys(filters).length > 0) {
      fetchDataWithApiFilters(filters);
    } else {
      getData();
    }
  }, [debouncedSearch, page]);

  // Update the handleDelete function to maintain filters after deletion
  const handleDelete = async (id: any) => {
    try {
      const res = await DeleteContactUs(id, lang);

      if (res?.message) {
        const successMessage =
          typeof res.message === "string"
            ? res.message
            : lang === "en"
            ? res.message.english
            : res.message.arabic;

        reToast.success(successMessage);
      } else {
        reToast.success(t("Contact Us Message deleted successfully"));
      }

      // Refresh data based on current state
      if (debouncedSearch) {
        await SearchData();
      } else if (Object.keys(filters).length > 0) {
        await fetchDataWithApiFilters(filters);
      } else {
        await getData();
      }

      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string | { english?: string; arabic?: string };
        error?: string;
      }>;

      let errorMessage = t("Deletion failed");

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

  // Helper function to get display name based on language
  const getDisplayName = (value: string, dataArray: any[], field: string) => {
    const item = dataArray.find((item) => item.value === value);
    if (!item) return value;
    return lang === "ar" ? item.name_ar : item.name_en;
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
          <ViewMore row={row} />
          <DeleteConfirmationDialog
            title="Deleting Contact Us Message"
            description="Are You Sure For Delete This Contact Us Message?"
            handleDelete={handleDelete}
            id={row.original.id}
          />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"ID"} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 mx-auto">
          <Badge variant="outline" className="font-mono">
            #{row.original.id}
          </Badge>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Name"} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 mx-auto">
          <span className="max-w-[200px] truncate font-medium">
            {row.original?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Email"} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 mx-auto">
          <span className="max-w-[250px] truncate font-medium text-blue-600">
            {row.original?.email || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "offers_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Position"} />
      ),
      cell: ({ row }) => {
        const positionName = getDisplayName(
          row.original.offers_name,
          Positions,
          "position"
        );
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <Badge variant="secondary" className="max-w-[200px] truncate">
              {positionName || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"City"} />
      ),
      cell: ({ row }) => {
        const cityName = getDisplayName(row.original.address, Cities, "city");
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <span className="max-w-[150px] truncate font-medium">
              {cityName || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Phone"} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 mx-auto">
          <span className="max-w-[150px] truncate font-medium">
            {row.original?.phone || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Created At"} />
      ),
      cell: ({ row }) => {
        const createdAt = row.original.created_at;
        const formattedDate = createdAt
          ? new Date(createdAt).toLocaleDateString("en-GB")
          : "N/A";

        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <Badge variant="outline" className="text-xs">
              {formattedDate}
            </Badge>
          </div>
        );
      },
    },
  ];

  const isPaginationDisabled = data.length < perPage;

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <GenericFilter
          fields={filterFields}
          onFilter={handleFilterApply}
          onReset={handleFilterReset}
          initialFilters={filters}
        />
      </div>

      {/* Active Filters Indicator */}
      {Object.keys(filters).length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="heroicons:funnel" className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Active Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  let displayValue = value;

                  // Convert filter values to display names
                  if (key === "offers_name" && value) {
                    displayValue = getDisplayName(value, Positions, "position");
                  } else if (key === "address" && value) {
                    displayValue = getDisplayName(value, Cities, "city");
                  } else if (typeof value === "object") {
                    displayValue = JSON.stringify(value);
                  }

                  return (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    >
                      {key}: {String(displayValue)}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFilterReset}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <Icon icon="heroicons:x-mark" className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {data.length} of {totalRecords} records
          {Object.keys(filters).length > 0 && " (filtered)"}
          {search && " (searched)"}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={data}
        setPage={setPage}
        setSearch={setSearch}
        searchPalsceholder={searchPalsceholder}
        page={currentPage}
        open={open}
        setOpen={setOpen}
        search={search}
        columns={columns}
        isPaginationDisabled={isPaginationDisabled}
        totalRecords={totalRecords}
        currentPage={currentPage}
        perPage={perPage}
      />
    </div>
  );
};

export default TableDataCareer;
