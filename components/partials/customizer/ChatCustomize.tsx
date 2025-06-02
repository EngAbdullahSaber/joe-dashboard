import { Messages } from "@/components/svg";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const ChatCustomize = () => {
  return (
    <div className="fixed ltr:right-4 rtl:left-4 bottom-14 z-50">
      <Link href="/chat">
        <Button size="icon" className=" relative h-12 w-12  rounded-full ">
          <Messages className="h-7 w-7 animate-pulse" />
        </Button>
      </Link>{" "}
    </div>
  );
};

export default ChatCustomize;
