"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { getServicesById } from "@/services/service/service";
import {
  CreateSubservice,
  DeleteSubservice,
  getSubservicesByServiceId,
  ReorderSubservices,
  UpdateSubservice,
} from "@/services/service/subservice";
import { CreateMedia } from "@/services/auth/auth";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { baseUrl } from "@/services/app.config";
import ImageUploader from "../ImageUploader";
import DeleteConfirmationDialog from "../../../(user-mangement)/shared/DeleteButton";
import Link from "next/link";

type Localized = { en: string; ar: string };

type SubserviceForm = {
  id?: number;
  title: Localized;
  description: Localized;
  slug: string;
  image: { url: string; alt: string };
  is_active: boolean;
  sort_order: number;
};

const emptyForm = (): SubserviceForm => ({
  title: { en: "", ar: "" },
  description: { en: "", ar: "" },
  slug: "",
  image: { url: "", alt: "" },
  is_active: true,
  sort_order: 0,
});

const SubservicesPage = () => {
  const { t } = useTranslate();
  const { lang, id } = useParams();
  const [serviceTitle, setServiceTitle] = useState<Localized | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SubserviceForm>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return a.id - b.id;
      }),
    [items]
  );

  const handleApiError = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{
      message?: string | { english?: string; arabic?: string };
      error?: string;
    }>;

    let errorMessage = fallback;
    if (axiosError.response?.data) {
      const responseData = axiosError.response.data;
      if (typeof responseData.message === "string") {
        errorMessage = responseData.message;
      } else if (typeof responseData.message === "object") {
        errorMessage =
          lang === "en"
            ? responseData.message.english || errorMessage
            : responseData.message.arabic || errorMessage;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }
    reToast.error(errorMessage);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const [serviceRes, subservicesRes] = await Promise.all([
        getServicesById(lang, id),
        getSubservicesByServiceId(id, lang, false),
      ]);
      setServiceTitle(serviceRes?.title || null);
      setItems(Array.isArray(subservicesRes) ? subservicesRes : []);
    } catch (error) {
      console.error("Error fetching subservices", error);
      reToast.error(t("Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [lang, id]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm(),
      sort_order: items.length,
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: {
        en: item.title?.en || "",
        ar: item.title?.ar || "",
      },
      description: {
        en: item.description?.en || "",
        ar: item.description?.ar || "",
      },
      slug: item.slug || "",
      image: {
        url: item.image?.url || "",
        alt: item.image?.alt || "",
      },
      is_active: item.is_active ?? true,
      sort_order: item.sort_order ?? 0,
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setImageFile(null);
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return form.image?.url ? form.image : null;
    const formData = new FormData();
    formData.append("files", imageFile);
    formData.append("alt[0]", form.image.alt || form.title.en || form.title.ar || "");
    const imageResponse = await CreateMedia(formData, lang);
    const uploaded = Array.isArray(imageResponse)
      ? imageResponse[0]
      : imageResponse;
    return {
      url: uploaded?.url || "",
      alt: form.image.alt || form.title.en || form.title.ar || "subservice",
    };
  };

  const handleSubmit = async () => {
    if (!form.title.en.trim() && !form.title.ar.trim()) {
      reToast.error(t("Title is required"));
      return;
    }

    setSaving(true);
    try {
      const image = await uploadImageIfNeeded();
      const payload = {
        service_id: Number(id),
        title: form.title,
        description: form.description,
        slug: form.slug || undefined,
        image: image?.url ? image : null,
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,
      };

      if (editingId) {
        await UpdateSubservice(payload, editingId, lang);
        reToast.success(t("Subservice updated successfully"));
      } else {
        await CreateSubservice(payload, lang);
        reToast.success(t("Subservice created successfully"));
      }
      closeForm();
      await getData();
    } catch (error) {
      handleApiError(error, t("Update failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subserviceId: any) => {
    try {
      await DeleteSubservice(subserviceId, lang);
      reToast.success(t("Subservice deleted successfully"));
      await getData();
      return true;
    } catch (error) {
      handleApiError(error, t("Update failed"));
      return false;
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      await UpdateSubservice(
        { is_active: !item.is_active },
        item.id,
        lang
      );
      await getData();
    } catch (error) {
      handleApiError(error, t("Update failed"));
    }
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sortedItems.length) return;

    const reordered = [...sortedItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);

    const itemsPayload = reordered.map((item, idx) => ({
      id: item.id,
      sort_order: idx,
    }));

    try {
      await ReorderSubservices(itemsPayload, lang);
      setItems(
        reordered.map((item, idx) => ({
          ...item,
          sort_order: idx,
        }))
      );
    } catch (error) {
      handleApiError(error, t("Update failed"));
    }
  };

  const serviceName =
    lang === "en" ? serviceTitle?.en : serviceTitle?.ar || serviceTitle?.en;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("Subservices Management")}</h1>
          {serviceName ? (
            <p className="text-sm text-default-500 mt-1">{serviceName}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Link href={`/${lang}/services/${id}/basic-info`}>
            <Button variant="outline">{t("Update Service")}</Button>
          </Link>
          <Button onClick={openCreate} className="gap-2">
            <Icon icon="heroicons:plus" className="h-4 w-4" />
            {t("Add Subservice")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Subservices")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-default-500">
              {t("Loading")}...
            </div>
          ) : sortedItems.length === 0 && !isFormOpen ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-default-100 flex items-center justify-center">
                <Icon
                  icon="heroicons:squares-plus"
                  className="h-7 w-7 text-default-500"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{t("No subservices yet")}</h3>
                <p className="text-sm text-default-500 mt-1">
                  {t("Add your first subservice")}
                </p>
              </div>
              <Button onClick={openCreate} className="gap-2">
                <Icon icon="heroicons:plus" className="h-4 w-4" />
                {t("Add your first subservice")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {item.image?.url ? (
                      <img
                        src={
                          item.image.url.startsWith("http")
                            ? item.image.url
                            : `${baseUrl}${item.image.url.replace(/^\/+/, "")}`
                        }
                        alt={item.image?.alt || item.title?.en || "subservice"}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md border bg-default-100 flex items-center justify-center">
                        <Icon
                          icon="heroicons:photo"
                          className="h-6 w-6 text-default-400"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {lang === "en" ? item.title?.en : item.title?.ar}
                      </h3>
                      <p className="text-xs text-default-500">/{item.slug}</p>
                      <p className="text-sm text-default-500 line-clamp-2">
                        {lang === "en"
                          ? item.description?.en
                          : item.description?.ar}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.is_active
                              ? "bg-success/10 text-success"
                              : "bg-default-200 text-default-600"
                          }`}
                        >
                          {item.is_active ? t("Active") : t("Inactive")}
                        </span>
                        <span className="text-xs text-default-400">
                          {t("Sort Order")}: {item.sort_order}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      title={t("Move Up")}
                    >
                      <Icon icon="heroicons:arrow-up" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === sortedItems.length - 1}
                      title={t("Move Down")}
                    >
                      <Icon icon="heroicons:arrow-down" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(item)}
                    >
                      {item.is_active ? t("Inactive") : t("Active")}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => openEdit(item)}
                    >
                      <Icon icon="heroicons:pencil" className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmationDialog
                      title="Deleting Subservice"
                      description="Are You Sure For Delete This Subservice?"
                      handleDelete={handleDelete}
                      id={item.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
              {editingId ? t("Edit Subservice") : t("Add Subservice")}
            </CardTitle>
            <Button variant="outline" onClick={closeForm}>
              {t("Cancel")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t("Title (EN)")} *</Label>
                <Input
                  value={form.title.en}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: { ...prev.title, en: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>{t("Title (AR)")} *</Label>
                <Input
                  value={form.title.ar}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: { ...prev.title, ar: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>{t("Slug")}</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="auto-generated-if-empty"
                />
              </div>
              <div>
                <Label>{t("Sort Order")}</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sort_order: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <Label>{t("Description (EN)")}</Label>
                <Textarea
                  value={form.description.en}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: {
                        ...prev.description,
                        en: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label>{t("Description (AR)")}</Label>
                <Textarea
                  value={form.description.ar}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: {
                        ...prev.description,
                        ar: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t("Image")}</Label>
                <ImageUploader
                  file={imageFile || form.image.url || null}
                  setFile={setImageFile}
                  previewUrl={form.image.url || null}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label>{t("Alt Text")}</Label>
                  <Input
                    value={form.image.alt}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        image: { ...prev.image, alt: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{t("Active")}</p>
                    <p className="text-xs text-default-500">
                      {form.is_active ? t("Active") : t("Inactive")}
                    </p>
                  </div>
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeForm} disabled={saving}>
                {t("Cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? t("Loading") : editingId ? t("Save") : t("Add Subservice")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubservicesPage;
