"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslate } from "@/config/useTranslation";
import { useEffect, useState } from "react";
interface RadioRightProps {
  text1: string;
  text2: string;
  setValue ?: any
  keyData ?: string
}
export const Radio: React.FC<RadioRightProps> = ({ setValue , text1, text2 , keyData }) => {
  const {t} = useTranslate()
	const handleValue = (e?:any)=>{ setValue && setValue(keyData , e) }

	useEffect(()=> {
		handleValue(text1)
	} ,[])
  return (
    <>
      <RadioGroup defaultValue={text1} className="!gap-[10px] max-md:grid max-md:grid-cols-2 ">
        <div className=" items-center gap-1 cursor-pointer grid grid-cols-[25px,1fr]  ">
          <RadioGroupItem onClick={(e:any)=> handleValue(e?.target?.value)} value={text1} id={text1}>  </RadioGroupItem>
          <Label className=" capitalize-first cursor-pointer" htmlFor={text1}>{t(text1)}</Label>
        </div>

        <div className="items-center gap-1 cursor-pointer grid grid-cols-[25px,1fr]">
          <RadioGroupItem onClick={(e:any)=> handleValue(e?.target?.value)} value={text2} id={text2}></RadioGroupItem>
          <Label className=" capitalize-first cursor-pointer" htmlFor={text2}>{t(text2)}</Label>
        </div>
      </RadioGroup>
    </>
  );
};
