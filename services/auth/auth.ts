import { apis } from "../axios";

export async function LogIn(data: any, lang: any) {
  let res = await apis.post(`api/v1/auth/login`, data, {
    headers: { "Accept-Language": lang, "Content-Type": "application/json" },
  });
  if (res) return res.data;
  else return false;
}
export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      target: targetLang,
    }),
  });

  const data = await response.json();
  return data.translatedText;
}

export const translateToArabic = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|ar`
    );
    const data = await response.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
};
export const translateToEnglish = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=ar|en`
    );
    const data = await response.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
};

export async function CreateMedia(data: any, lang: any) {
  let res = await apis.post(`api/v1/images?lang=${lang}`, data, {
    headers: {
      "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
    },
  });
  if (res) return res.data;
  else return false;
}
