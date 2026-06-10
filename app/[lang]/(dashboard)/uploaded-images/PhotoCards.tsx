"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { getPhotosPagination, DeletePhoto } from "@/services/photos/photos";
import { ImageUrl } from "@/services/app.config";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteConfirmationDialog from "../(user-mangement)/shared/DeleteButton";

interface Photo {
  id: number;
  name: string;
  photo_url: string;
  created_at: string;
}

interface PhotoCardsProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const getFullUrl = (photoUrl: string) => {
  if (!photoUrl) return "";
  if (photoUrl.startsWith("http")) return photoUrl;
  return `${ImageUrl}${photoUrl}`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PhotoCards = ({ flag, setFlag }: PhotoCardsProps) => {
  const { lang } = useParams();
  const { t } = useTranslate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const PER_PAGE = 12;

  const fetchPhotos = async (p: number) => {
    setLoading(true);
    try {
      const res = await getPhotosPagination(p, lang);
      const items: Photo[] = Array.isArray(res) ? res : res?.data || [];
      setPhotos(items);
      const meta = res?.meta || res?.pagination;
      if (meta) {
        setTotalPages(meta.total_pages || meta.last_page || Math.ceil(meta.total / PER_PAGE) || 1);
        setHasMore(p < (meta.total_pages || meta.last_page || 1));
      } else {
        setHasMore(items.length >= PER_PAGE);
        setTotalPages(items.length >= PER_PAGE ? p + 1 : p);
      }
    } catch (err) {
      reToast.error(t("Failed to load images"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(page);
  }, [page, flag]);

  const handleDelete = async (id: number) => {
    try {
      const res = await DeletePhoto(id, lang);
      const msg =
        typeof res?.message === "string"
          ? res.message
          : lang === "en"
          ? res?.message?.english
          : res?.message?.arabic;
      reToast.success(msg || t("Image deleted successfully"));
      fetchPhotos(page);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string | { english?: string; arabic?: string };
        error?: string;
      }>;
      let errMsg = t("Failed to delete image");
      const data = axiosError.response?.data;
      if (typeof data?.message === "string") errMsg = data.message;
      else if (typeof data?.message === "object") {
        errMsg = (lang === "en" ? data.message.english : data.message.arabic) || errMsg;
      }
      reToast.error(errMsg);
      return false;
    }
  };

  const handleView = (photoUrl: string) => {
    window.open(getFullUrl(photoUrl), "_blank");
  };

  const handleDownload = async (photo: Photo) => {
    const url = getFullUrl(photo.photo_url);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = photo.name || "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      // fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const handleCopyUrl = (photoUrl: string) => {
    const url = getFullUrl(photoUrl);
    navigator.clipboard.writeText(url).then(() => {
      reToast.success(t("URL copied to clipboard"));
    });
  };

  const handleShare = (photo: Photo) => {
    const url = getFullUrl(photo.photo_url);
    if (navigator.share) {
      navigator.share({ title: photo.name, url }).catch(() => {});
    } else {
      handleCopyUrl(photo.photo_url);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-default-100 animate-pulse h-64"
          />
        ))}
      </div>
    );
  }

  if (!photos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-default-400">
        <Icon icon="heroicons:photo" className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg">{t("No images uploaded yet")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card
            key={photo.id}
            className="overflow-hidden group hover:shadow-lg transition-shadow duration-200"
          >
            <div
              className="relative h-48 bg-default-100 cursor-pointer overflow-hidden"
              onClick={() => handleView(photo.photo_url)}
            >
              <img
                src={getFullUrl(photo.photo_url)}
                alt={photo.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <Icon
                  icon="heroicons:eye"
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            </div>
            <CardContent className="p-3">
              <p
                className="text-sm font-medium text-default-800 truncate mb-1"
                title={photo.name}
              >
                {photo.name}
              </p>
              <p className="text-xs text-default-400 mb-3">
                {formatDate(photo.created_at)}
              </p>
              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleView(photo.photo_url)}
                      >
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("View Image")}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleDownload(photo)}
                      >
                        <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("Download")}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleShare(photo)}
                      >
                        <Icon icon="heroicons:share" className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("Share")}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleCopyUrl(photo.photo_url)}
                      >
                        <Icon icon="heroicons:link" className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("Copy URL")}</TooltipContent>
                  </Tooltip>

                  <div className="ml-auto">
                    <DeleteConfirmationDialog
                      title={"Delete Image"}
                      description={"Are you sure you want to delete this image?"}
                      handleDelete={() => handleDelete(photo.id)}
                      id={photo.id.toString()}
                    />
                  </div>
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
          {t("Previous")}
        </Button>
        <span className="text-sm text-default-600 px-3">
          {t("Page")} {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore || loading}
        >
          {t("Next")}
          <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PhotoCards;
