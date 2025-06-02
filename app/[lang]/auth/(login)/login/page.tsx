"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import background from "@/public/images/auth/line.png";
import logo from "@/public/images/logo/loogoo.png";
import { X } from "lucide-react";
import { Fragment, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LogInForm from "@/components/auth/login-form";
import { LogoWhite, SiteLogo } from "@/components/svg";
const LoginPage = () => {
  console.log(logo);
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  return (
    <Fragment>
      <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full  relative hidden xl:flex justify-center items-center bg-gradient-to-br
          from-primary-600 via-primary-400 to-primary-600
         "
          >
            <Image
              src={background}
              alt="image"
              className="absolute top-0 left-0 w-full h-full "
            />

            <LogoWhite className="h-[300px] w-[300px]" />
          </div>

          <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
            <div className="lg:w-[480px] ">
              <LogInForm />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
