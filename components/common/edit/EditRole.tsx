'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslate } from '@/config/useTranslation';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Icon } from '@iconify/react';
import { Select } from '@/components/common/atoms/Select';
import { Radio } from '@/components/common/atoms/Radio';
import FileUploadWithButton from '../atoms/FileUpload';
import Flatpickr from 'react-flatpickr';
import Divider from '../atoms/Divider';
import { requiredFieldsRolesEdit } from '@/config/columnsRequired';

// Options for selects

const EditRole = ({  titleBtn, titleHeader }: { titleBtn: string; titleHeader: string }) => {
  const { t, lang } = useTranslate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register
  } = useForm();


  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
      <Button size="icon" variant="outline" className=" h-7 w-7" color="secondary" >   <Icon icon="heroicons:pencil" className="h-4 w-4" /> </Button>
      </SheetTrigger>

      <SheetContent side={lang === 'ar' ? 'left' : 'right'} dir={lang === 'ar' ? 'rtl' : 'ltr'} className='max-w-[600px] w-full  p-5 overflow-y-scroll'>
        <SheetHeader className='py-3 pl-3.5'>
          <SheetTitle> {titleHeader} </SheetTitle>{' '}
        </SheetHeader>
        <hr />
        <div className='flex flex-col gap-4'> 

            <div className='w-full relative flex flex-col gap-2 mt-[20px] '>
              <Label className='capitalize' > {t("Role name")} </Label>
              <Input className='placeholder:capitalize' {...register("rolename")}  type='text' />
            </div>

            {
              requiredFieldsRolesEdit?.map((e:any,i:number)=>( <EachField title={e.name} data={e.values} /> ))
            }

        </div>

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
                {t("Save")}
              </Button>
            </div>
      </SheetContent>
    </Sheet>
  );
};



function EachField ({title , data}:{title:string , data:any}){
  const {t} = useTranslate()

  const [values , setValues]= useState<any>([])
  const handleClick = (e:any) => {
    setValues((prev: any) => {
      if (prev?.includes(e)) {
        return prev?.filter((ele: any) => ele !== e);
      } else {
        // If it doesn't exist, add it
        return [...prev, e];
      }
    });
  };


  useEffect(()=> {
    console.log(values)
  } ,[values])
  return (
    <div>
      <Divider />

      <div className=' mt-[20px] grid grid-cols-[120px,1fr] max-sm:grid-cols-1 h-full gap-[10px] ' >
        <h3> {t(title)} </h3>
        <div className="grid grid-cols-[1fr,1fr,1fr] max-[400px]:grid-cols-2 h-full gap-[5px] ">
          {data?.map((e:any,i:number)=> ( 
            <span onClick={() => handleClick(e)} key={i} className={` ${values?.includes(e) ? "bg-primary text-white " : ""} flex items-center justify-center text-center  border-[1px] border-primary max-sm:p-[5px] max-sm:text-[12px] rounded-[6px] p-[10px] capitalize cursor-pointer hover:bg-primary hover:text-white duration-300`} > {t(e)} </span>
             ))}
        </div>
      </div>

      
    </div>
  )
}


export default EditRole;
