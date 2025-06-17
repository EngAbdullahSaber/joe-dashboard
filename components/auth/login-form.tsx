"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LogIn } from "../../services/auth/auth";
import { storeTokenInLocalStorage } from "@/services/utils";
import { useParams, useRouter } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { LogoBlack, LogoWhite } from "../svg";
import { useTheme } from "next-themes";
interface ErrorResponse {
  errors?: string[];
  message?: any;
  error?: any;
}

const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const [password, setPassword] = React.useState("");
  const { lang } = useParams();
  const { t } = useTranslate();
  const router = useRouter();
  const { theme } = useTheme();

  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await LogIn({ email: email, password: password }, lang);

      if (res) {
        reToast.success("Login Successfully");

        storeTokenInLocalStorage(res?.access_token);
      }
      router.push("/home-page");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      reToast.error(axiosError.response?.data?.message || "An error occurred");
    }
  };
  return (
    <div className="w-full py-10">
      {theme == "dark" ? <LogoWhite /> : <LogoBlack />}

      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        {t("Hey, Hello 👋")}
      </div>
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        {t("Enter the information you entered while registering")}
      </div>
      <form onSubmit={handleSubmit} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            {t("Email")}{" "}
          </Label>
          <Input
            disabled={isPending}
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            size={!isDesktop2xl ? "xl" : "lg"}
            value={email}
          />
        </div>

        <div className="mt-3.5 my-3">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            {t("Password")}{" "}
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}
            >
              {passwordType === "password" ? (
                <Icon
                  icon="heroicons:eye"
                  className="w-5 h-5 text-default-400"
                />
              ) : (
                <Icon
                  icon="heroicons:eye-slash"
                  className="w-5 h-5 text-default-400"
                />
              )}
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && <Loader2 className="mr-2 my-3 h-4 w-4 animate-spin" />}
          {isPending ? t("Loading") : t("Sign In")}
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;
