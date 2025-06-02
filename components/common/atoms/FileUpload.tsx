"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { Upload } from "lucide-react";
import { useState } from "react";


const FileUploadWithButton = ({classname , keyData , setValue}:any) => {
  const {t} = useTranslate()

  const [File , setFile ] = useState({ name : "" , value: ""  })
  
  const handleFile = (e:any) =>{
    const file = e.target.files[0];
    setFile({ value : file ,  name : file.name})
    setValue(keyData ,  file )
  }


  return (
    <div className={`flex  flex-col gap-5 ${classname}`}>
      <div className="flex  items-center flex-wrap gap-4 w-full ">
        <Label className="w-full capitalize-first" >
          <div>
            <Button className={`${classname} !rounded-[4px]`}  asChild color="info" variant="outline">
              <div className={` flex items-center gap-[10px] cursor-pointer ${File.name && "!bg-black !text-white "} `} > 
                <span className="" > { `${File.name?.slice(0,15) ||  t("Choose File") } ` } </span> 
                <Upload className=" ml-2 h-4 w-4" />
              </div>
            </Button>
          </div>
          <Input type="file" onChange={handleFile} className="hidden" />
        </Label>
      </div>
    </div>
  );
};
export default FileUploadWithButton;
