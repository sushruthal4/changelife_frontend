import React, { useRef } from "react";
import { Upload } from "lucide-react";

type StorageUploadFieldProps = {
  accept: string;
  label: string;
  helperText: string;
  loading?: boolean;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
};

export const StorageUploadField: React.FC<StorageUploadFieldProps> = ({
  accept,
  label,
  helperText,
  loading,
  multiple,
  onFiles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        disabled={loading}
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          if (files.length) {
            onFiles(files);
          }
          event.currentTarget.value = "";
        }}
        className='hidden'
      />
      <button
        type='button'
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className='flex min-h-24 w-full items-center justify-center rounded border-2 border-dashed border-brand-dark/15 bg-brand-muted px-4 py-5 text-center transition hover:border-brand-primary hover:bg-white disabled:opacity-60'
      >
        <span>
          <Upload className='mx-auto mb-2 h-6 w-6 text-brand-primary' />
          <span className='block text-sm font-bold text-brand-dark'>
            {loading ? "Uploading..." : label}
          </span>
          <span className='mt-1 block text-xs text-brand-dark/55'>{helperText}</span>
        </span>
      </button>
    </div>
  );
};
