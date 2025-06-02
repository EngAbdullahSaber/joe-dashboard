"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@/config/useTranslation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { Select } from "@/components/common/atoms/Select";
import { Radio } from "@/components/common/atoms/Radio";
import FileUploadWithButton from "../atoms/FileUpload";
import Flatpickr from "react-flatpickr";

// Options for selects

const Create = ({
  requiredFields,
  titleBtn,
  titleHeader,
}: {
  requiredFields: any;
  titleBtn: string;
  titleHeader: string;
}) => {
  const { t, lang } = useTranslate();
  const [switichLang, setswitichLang] = useState("en");

  const validationSchema = yup.object(
    requiredFields.reduce((schema: any, field: any) => {
      const suffix =
        t(field?.name)?.slice(-1) === "ة" ? t("isRequired2") : t("isRequired");

      if (field.type === "input") {
        if (field.name === "email") {
          schema[`${field.name}_en`] = yup.string().required(`${t(field.name)} ${suffix} `).email(`${t(field.name)} ${t("mustBeAValidEmail")}`);
          schema[`${field.name}_ar`] = yup.string().required(`${t(field.name)} ${suffix} `).email(`${t(field.name)} ${t("mustBeAValidEmail")}`);
        }
        else if (field.name === "phone number") {
          const phoneRegex = /^\+?[0-9]{10,15}$/    // Adjust regex to match your phone number format
          schema[`${field.name}_en`] = yup .string() .required(`${t(field.name)} ${suffix} `) .matches(phoneRegex, `${t(field.name)} ${t("mustBeAValidPhone")}`);
          schema[`${field.name}_ar`] = yup .string() .required(`${t(field.name)} ${suffix} `) .matches(phoneRegex, `${t(field.name)} ${t("mustBeAValidPhone")}`);
        }
        else {
          schema[`${field.name}_en`] = yup.string().required(`${t(field.name)} ${suffix} ` );  
          schema[`${field.name}_ar`] = yup.string().required(`${t(field.name)} ${suffix}  ` );  
        }
      } else if (field.type === "select") {
        
          schema[`${field.name}_en`] = yup.string().required(`${t(field.name)} ${suffix} `).email(`${t(field.name)} ${t("mustBeAValidEmail")}`);
          schema[`${field.name}_ar`] = yup.string().required(`${t(field.name)} ${suffix} `).email(`${t(field.name)} ${t("mustBeAValidEmail")}`);
        
      } else if (field.type === "textarea") {
        schema[`${field.name}`] = yup
          .string()
          .required(`${t(field.name)} ${suffix} `);
      } else if (field.type === "radio") {
        schema[field.name] = yup
          .string()
          .required(`${t(field.name)} ${suffix}`);
      }
      return schema;
    }, {})
  );

  const { control, handleSubmit, formState: { errors },setValue } = useForm({ mode : "onChange" , resolver: yupResolver(validationSchema) });

  const [errorAr, seterrorAr] = useState<string>();
  const [errorEn, seterrorEn] = useState<string>();
  useEffect(() => {
    for (const key in errors) {
      key.endsWith("_ar") ? seterrorAr("bg-error") : seterrorAr("");
      key.endsWith("_en") ? seterrorEn("bg-error") : seterrorEn("");
    }
  }, [errors]);

  const onSubmit = (data: any) => {
    console.log(data);
    seterrorAr("");
    seterrorEn("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Icon icon="mingcute:user-add-2-fill" /> {titleBtn}
        </Button>
      </SheetTrigger>

      <SheetContent
        side={lang === "ar" ? "left" : "right"}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="max-w-lg  max-md:max-w-full p-5 overflow-y-scroll"
      >
        <SheetHeader className="py-3 pl-3.5">
          {" "}
          <SheetTitle> {titleHeader} </SheetTitle>{" "}
        </SheetHeader>
        <hr />
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="English" className="flex flex-col gap-[40px]">
            <TabsList className="grid w-full grid-cols-2 gap-[5px] mt-[20px]">
              <TabsTrigger
                className={errorEn}
                onClick={() => setswitichLang("en")}
                value="English"
              >
                {" "}
                {t("English")}{" "}
              </TabsTrigger>
              <TabsTrigger
                className={errorAr}
                onClick={() => setswitichLang("ar")}
                value="Arabic"
              >
                {" "}
                {t("Arabic")}{" "}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="English">
              <div className="flex flex-col gap-4">
                {requiredFields.map((field: any, index: number) => {
                  if (index % 2 === 0) {
                    const nextField = requiredFields[index + 1];
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-2 max-md:grid-cols-1 items-center gap-[10px]"
                      >
                        {renderField(field, control, errors, "en", setValue)}
                        {nextField &&
                          renderField(
                            nextField,
                            control,
                            errors,
                            "en",
                            setValue
                          )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </TabsContent>

            <TabsContent value="Arabic">
              <div className="flex flex-col gap-4">
                {requiredFields.map((field: any, index: number) => {
                  if (index % 2 === 0) {
                    const nextField = requiredFields[index + 1];
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-2 max-md:grid-cols-1 items-center gap-[10px]"
                      >
                        {renderField(field, control, errors, "ar", setValue)}
                        {nextField &&
                          renderField(
                            nextField,
                            control,
                            errors,
                            "ar",
                            setValue
                          )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </TabsContent>

            <div className="flex justify-center gap-3 mt-4">
              <SheetClose asChild>
                <Button type="button" className="w-full" variant="outline">
                  {t("Cancel")}
                </Button>
              </SheetClose>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="w-full"
              >
                {t("Create")}
              </Button>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const renderField = (
  field: any,
  control: any,
  errors: any,
  switchLang: string,
  setValue: any
) => {
  const { t, lang } = useTranslate();
  const [picker, setPicker] = useState<Date>(new Date());

  switch (field.type) {
    case 'input': return (
        <div className='w-full relative flex flex-col gap-2 mb-[20px] ' key={field.name}>
          <Label className='capitalize' >{t(field.name.toLowerCase())}</Label>
          <Controller name={field.name+`_${switchLang}`} control={control} render={({ field: inputProps }) => <Input className='placeholder:capitalize'  type='text' placeholder={field.name == "phone number" ? "+966 12 345 6789" : t(field.name.toLowerCase())} {...inputProps} />} />
          {errors[`${field.name}_${switchLang}`] && <p className={`text-red-500 absolute leading-[15px] capitalize-first ${lang == "ar" ? "right-0" : "left-0"} top-[100%]  text-[12px]`}>{errors[`${field.name}_${switchLang}`].message}</p>}
        </div>
      );
      case 'textarea': return (
        <div className='w-full relative flex flex-col gap-2 mb-[20px] ' key={field.name}>
          <Label className='capitalize' >{t(field.name.toLowerCase())}</Label>
          <Controller name={field.name+`_${switchLang}`} control={control} render={({ field: inputProps }) => <Input className='placeholder:capitalize'  type='text' placeholder={field.name == "phone number" ? "+966 12 345 6789" : t(field.name.toLowerCase())} {...inputProps} />} />
          {errors[`${field.name}_${switchLang}`] && <p className={`text-red-500 absolute leading-[15px] capitalize-first ${lang == "ar" ? "right-0" : "left-0"} top-[100%]  text-[12px]`}>{errors[`${field.name}_${switchLang}`].message}</p>}
        </div>
      );
    case 'select': return (
        <div className='w-full flex relative flex-col gap-2 mb-[20px]' key={field.name}>
          <Controller name={field.name} control={control} render={({ field: selectProps }) => (
            <Select place={t(field.name)} label={t(field.name)}  data={field?.data}   setValue={setValue}   keyData={field.name}   />
            )} />
          {errors[`${field.name}`] && <p className={`text-red-500 capitalize-first absolute ${lang == "ar" ? "right-0" : "left-0"} top-[100%]  text-[12px]`}>{errors[`${field.name}`].message}</p>}
        </div>
      );
    case 'date': return (
      <div className="flex flex-col gap-2 w-full   mt-[-20px] max-md:mt-0 ">
      <Label className='capitalize-first' > {t(field.name)} </Label>
      <div  className='relative' >
        <div className=' absolute left-[10px] top-[50%] translate-y-[-50%] ' > <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#878b94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg> </div>
        
        <Flatpickr
        onClick={(e) => e.stopPropagation()}
        options={{
          appendTo: document.body, // Avoid DOM conflicts; ensure proper rendering
          static: true, // Keeps the calendar inline (if possible)
          clickOpens: true, // Ensure the calendar remains interactive
        }}
        onClose={() => {
          document.querySelector('.modal-class')?.classList.remove('disable-focus-trap');
        }}
          className=" border border-default-300  !text-[#878b94] font-[300] capitalize-first  pl-[30px] w-full cursor-pointer h-[36px]  focus:border-[#2684ff] focus:outline-none rounded-[4px] px-2 placeholder:text-default-600"
          placeholder= {t(field.name)}
          value={picker}
          onChange={(e: any) => {    setPicker(e[0]|| null) , setValue(field.name , e[0] || null); }}
          id="default-picker"
        />
      </div>
    </div>
      );

    case "radio":
      return (
        <Radio
          setValue={setValue}
          keyData={field.name}
          text1={field?.data?.[0]}
          text2={field?.data?.[1]}
        />
      );
    case "chooseFile":
      return (
        <FileUploadWithButton
          keyData={field.name}
          setValue={setValue}
          classname="w-full h-[33px] "
        />
      );
    default:
      return null;
  }
};

export default Create;
