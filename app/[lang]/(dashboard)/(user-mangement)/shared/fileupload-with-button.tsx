"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { translate } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";

const FileUploadWithButton = () => {
  const { t } = useTranslate();
  return (
    <div className="flex  flex-col gap-5">
      <div className="flex items-center flex-wrap gap-4">
        {/* <Label>
          <Button asChild>
            <div>
              <Upload className="mr-2 h-4 w-4" /> Choose File
            </div>
          </Button>
          <Input type="file" className="hidden" />
        </Label>
        <Label>
          <div>
            <Button asChild color="success">
              <div>
                Choose File <Upload className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </div>
          <Input type="file" className="hidden" />
        </Label> */}

        <Label>
          <div>
            <Button asChild color="info" variant="outline">
              <div>
                {t("Choose File")}
                <Upload className=" mx-2 h-4 w-4" />
              </div>
            </Button>
          </div>
          <Input type="file" className="hidden" />
        </Label>
      </div>
    </div>
  );
};
export default FileUploadWithButton;
