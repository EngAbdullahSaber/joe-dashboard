import BasicSelect from "@/app/[lang]/(dashboard)/(user-mangement)/shared/basic-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import React, { useEffect, useState } from "react";

interface FilterProps {
  table: any;
}

const Filter: React.FC<FilterProps> = ({ table }: FilterProps) => {
  const [columns, setcolumns] = useState<any>();
  const { t } = useTranslate();

  // useEffect(() => {
  //     // const res = table?.options?.columns?.filter((e: any) => e?.accessorKey)
  //     setcolumns(table)
  // }, [])

  const retailer = [
    { value: t("value 1"), label: t("value 1") },
    { value: t("value 2"), label: t("value 2") },
    { value: t("value 3"), label: t("value 3") },
  ];

  return (
    <div className="mt-[20px] flex flex-col gap-[30px]  ">
      {/* {columns &&
        columns.map((e: any, i: number) => {
          const pairIndex = Math.floor(i / 2);
          if (i % 2 === 0) {
            return ( */}
      {/* <div key={pairIndex} className="flex items-center gap-[10px]"> */}
      {table.map((item: any) => {
        return (
          <div className="flex items-center gap-[10px]">
            <div className="w-full flex flex-col gap-2">
              {/* <Label className='capitalize ' >{t(e?.accessorKey?.toLowerCase())}</Label> */}
              <Label className="capitalize ">{item.name}</Label>
              <BasicSelect data={retailer} />
            </div>
            {/* {columns[i + 1] && ( */}
            <div className="w-full flex flex-col gap-2">
              {/* <Label className='capitalize ' >{t(columns[i + 1]?.accessorKey?.toLowerCase())}</Label> */}
              <Label className="capitalize ">{item.nameTwo}</Label>
              <BasicSelect data={retailer} />
            </div>
            {/* )} */}
          </div>
        );
      })}

      {/* );
          }
          return null;
        })} */}

      <div className=" flex justify-center gap-3 mt-4 ">
        <Button type="button" variant="outline" className="w-full">
          {" "}
          {t("reset")}
        </Button>
        <Button type="button" className="w-full">
          {" "}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
};

export default Filter;
