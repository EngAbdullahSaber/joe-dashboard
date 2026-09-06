"use client";

import { useParams } from "next/navigation";
import { Auth } from "@/components/auth/Auth";
import HomeVisualEditor from "@/components/cms/HomeVisualEditor";

const page = () => {
  const { lang } = useParams();
  return <HomeVisualEditor lang={lang} />;
};

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
