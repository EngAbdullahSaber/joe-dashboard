import React from "react";
import ViewMore from "./View";
import DeleteButton from "./Delete";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";

import Withdraw from "../atoms/Withdraw";
interface ActionsProps {
  deleteBtn?: boolean;
  viewBtn?: boolean;
  editBtn?: boolean;
  withdrawBtn?: boolean;
  row?: any;
  title: string;
}

const Actions: React.FC<ActionsProps> = ({
  title,
  row,
  deleteBtn = true,
  viewBtn = true,
  editBtn = true,
  withdrawBtn = false,
}) => {
  return (
    <div className="flex gap-[5px]  w-full justify-center ">
      {editBtn && (
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
          color="secondary"
        >
          {" "}
          <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
        </Button>
      )}
      {viewBtn && <ViewMore title={title} data={row} />}
      {deleteBtn && <DeleteButton />}
      {withdrawBtn && <Withdraw />}
    </div>
  );
};

export default Actions;
