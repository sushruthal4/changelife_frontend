import axios from "axios";
import getApiClient, { ApiResponse } from "@/lib/api/client";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export type StorageBucket = "images" | "videos" | "documents";

export type UploadedMedia = {
  url: string;
  path: string;
  bucket: StorageBucket;
  originalName: string;
  resourceType: "image" | "video" | "document";
};

function getSupabaseUrl() {
  return rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

function assertStorageConfig() {
  const supabaseUrl = getSupabaseUrl();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in heart-fuel/.env.local");
  }

  return { supabaseUrl, supabaseAnonKey };
}

function hasDirectStorageConfig() {
  return Boolean(getSupabaseUrl() && supabaseAnonKey);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

function getResourceType(file: File): UploadedMedia["resourceType"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

export function getBucketForFile(file: File): StorageBucket {
  const resourceType = getResourceType(file);
  if (resourceType === "video") return "videos";
  if (resourceType === "image") return "images";
  return "documents";
}

export async function uploadFileToStorage(
  file: File,
  options: {
    bucket?: StorageBucket;
    folder?: string;
  } = {},
): Promise<UploadedMedia> {
  try {
    return await uploadFileThroughApi(file, options);
  } catch (error) {
    const shouldFallback =
      axios.isAxiosError(error) &&
      (error.response?.status === 404 || error.response?.status === 405) &&
      hasDirectStorageConfig();

    if (!shouldFallback) {
      throw error;
    }
  }

  return uploadFileDirectly(file, options);
}

async function uploadFileThroughApi(
  file: File,
  options: {
    bucket?: StorageBucket;
    folder?: string;
  } = {},
): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", options.bucket || getBucketForFile(file));
  formData.append("folder", options.folder || "uploads");

  const api = getApiClient();
  const response = await api.post<ApiResponse<UploadedMedia>>("/storage/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}

async function uploadFileDirectly(
  file: File,
  options: {
    bucket?: StorageBucket;
    folder?: string;
  } = {},
): Promise<UploadedMedia> {
  const { supabaseUrl, supabaseAnonKey } = assertStorageConfig();
  const bucket = options.bucket || getBucketForFile(file);
  const folder = (options.folder || "uploads").replace(/^\/+|\/+$/g, "");
  const safeName = sanitizeFileName(file.name || "upload");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: file,
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || `Upload failed with ${response.status}`);
  }

  return {
    url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`,
    path,
    bucket,
    originalName: file.name,
    resourceType: getResourceType(file),
  };
}

export async function uploadFilesToStorage(
  files: File[],
  options: {
    bucket?: StorageBucket;
    folder?: string;
  } = {},
) {
  return Promise.all(files.map((file) => uploadFileToStorage(file, options)));
}
