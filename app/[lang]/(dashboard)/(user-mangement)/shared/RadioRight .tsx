"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
interface RadioRightProps {
  text1: string;
  text2: string;
  setval?: (val: string) => void;
}
const RadioRight: React.FC<RadioRightProps> = ({ setval, text1, text2 }) => {
  return (
    <>
      <RadioGroup defaultValue={text1} className="!gap-[20px] ">
        <div className="flex items-center gap-1 cursor-pointer ">
          <RadioGroupItem
            onClick={(e: any) => setval && setval(e?.target?.value)}
            value={text1}
            id={text1}
          >
            {" "}
          </RadioGroupItem>
          <Label className="cursor-pointer" htmlFor={text1}>
            {text1}
          </Label>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <RadioGroupItem
            onClick={(e: any) => setval && setval(e?.target?.value)}
            value={text2}
            id={text2}
          ></RadioGroupItem>
          <Label className="cursor-pointer" htmlFor={text2}>
            {text2}
          </Label>
        </div>
      </RadioGroup>
    </>
  );
};
export default RadioRight;
