"use client";
import { useTranslate } from "@/config/useTranslation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface PropsCountries {
  keyData: string;
  label?: string;
  place?: string;
  classname?: string;
  width?: string;
  height?: string;
  setValue?: any;

  classnameLabel?: string;
  data?: any;
}

export const Select: React.FC<PropsCountries> = ({  data , classnameLabel ,  keyData, label, classname, width, height, place, setValue }) => {
  const {lang} = useTranslate()
  const [show, setShow] = useState(false);
  const [selectData, setSelectData] = useState<any>(place || data[0]?.label);


  const handleValue = (e: any) => {
    setSelectData(e?.label);
    setShow(!show);
    setValue && setValue(keyData , e?.value ) 
  };

  useEffect(()=> {
    handleValue(data[0])  ; 
    setShow(false)
  } ,[data])



  //! onBlur Close the Select
  const selectRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setShow(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <div className={` selectCustom flex max-sm:flex-wrap gap-[20px] relative ${width}`}>
        <div className={` h-full w-full relative ${classname} `} ref={selectRef}>
          {label && ( <label className={`text-[14px] font-[600] capitalize `} htmlFor={keyData}> {label} </label> )}

          <div className={`w-full ${height || "h-[37px]"} input bg-white  mt-[5px] rounded-[5px] border-[1px]  relative`} id={keyData}>
            <div onClick={() => data.length >= 1 && setShow(!show)} className={`flex gap-[10px] items-center px-[10px] relative z-[230] h-full cursor-pointer`}>
              <div className={` text-xs P-12 text-[#878b94] flex items-center gap-[8px]`}  >{selectData}</div>
              <div className="ltr:border-l-[2px] rtl:border-r-[2px] border-[#cccccc] absolute w-[25px] ltr:right-0 rtl:left-0 h-[15px] flex items-center justify-center " > <svg  className={` stroke-[#cccccc]   duration-300 transition-all w-[11px] h-[11px]  `} width="13" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.2773 1.5L9.13888 9L2.00042 1.5" stroke="" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> </svg></div>
            </div>

            { <div className={` ${show ? "block" : "hidden"} shadow-inner z-[1000]  rounded-[5px] duration-500  absolute bg-white w-[100%] shadow_box border-[1px] border-gray-200 max-h-[160px] overflow-y-auto top-[110%]`}>
              {data?.map((e: any, i: number) => (
                <div  onClick={() => handleValue(e)} className="flex items-center gap-[10px] w-full px-[10px] hover:bg-[#e9e9e9] duration-300 cursor-pointer" > 
                  <div className={`flex py-[5px] P-12  !text-[12px] items-center gap-[10px] min-h-[40px]`} key={i} > {e?.label} </div>
                </div>
              ))}
            </div>}
          </div>
        </div>
      </div>
    
  );
};
