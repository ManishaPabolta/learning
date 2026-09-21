import { useRef, useState } from "react";

import {
  File as FileIcon,
  UploadCloud,
  X,
} from "lucide-react";

const FileUploader = ({
  onUpload,
  uploading = false,
}) => {
  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // =====================================================
  // SELECT FILE
  // =====================================================

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

    // Browser native File check
    if (!(file instanceof globalThis.File)) {
      console.error("Invalid file selected:", file);
      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFileSelect(file);
  };

  // =====================================================
  // OPEN FILE PICKER
  // =====================================================

  const openFilePicker = () => {
    if (uploading) {
      return;
    }

    inputRef.current?.click();
  };

  // =====================================================
  // UPLOAD
  // =====================================================

  const handleUploadClick = async () => {
    if (!selectedFile) {
      console.warn("No file selected");
      return;
    }

    if (uploading) {
      return;
    }

    try {
      // IMPORTANT:
      // Send the actual browser File object.
      await onUpload(selectedFile);

      // Clear after upload
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "FileUploader upload error:",
        error
      );
    }
  };

  // =====================================================
  // REMOVE SELECTED FILE
  // =====================================================

  const removeSelectedFile = () => {
    if (uploading) {
      return;
    }

    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // =====================================================
  // DRAG ENTER
  // =====================================================

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!uploading) {
      setDragActive(true);
    }
  };

  // =====================================================
  // DRAG LEAVE
  // =====================================================

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);
  };

  // =====================================================
  // DRAG OVER
  // =====================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!uploading) {
      setDragActive(true);
    }
  };

  // =====================================================
  // DROP
  // =====================================================

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    if (uploading) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    handleFileSelect(file);
  };

  // =====================================================
  // FORMAT FILE SIZE
  // =====================================================

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) {
      return "0 Bytes";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${(
      bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-4">
      {/* =================================================
          HIDDEN FILE INPUT
      ================================================= */}

      <input
        ref={inputRef}
        type="file"
        hidden
        disabled={uploading}
        onChange={handleInputChange}
      />

      {/* =================================================
          DROP AREA
      ================================================= */}

      <div
        onClick={openFilePicker}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={[
          "cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all",
          dragActive
            ? "border-purple-500 bg-purple-50"
            : "border-slate-300 bg-white hover:border-purple-400 hover:bg-purple-50/30",
          uploading
            ? "cursor-not-allowed opacity-60"
            : "",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-xl flex-col items-center">
          {/* ICON */}

          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
            <UploadCloud
              size={32}
              className="text-purple-600"
            />
          </div>

          {/* TITLE */}

          <h3 className="text-lg font-bold text-slate-900">
            Upload Project File
          </h3>

          {/* DESCRIPTION */}

          <p className="mt-2 text-sm text-slate-500">
            Upload code, images, documents or design
            assets
          </p>

          {/* CHOOSE FILE */}

          <button
            type="button"
            disabled={uploading}
            onClick={(event) => {
              event.stopPropagation();
              openFilePicker();
            }}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Choose File
          </button>

          <p className="mt-3 text-xs text-slate-400">
            Or drag and drop a file here
          </p>
        </div>
      </div>

      {/* =================================================
          SELECTED FILE
      ================================================= */}

      {selectedFile && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <FileIcon
                  size={22}
                  className="text-purple-600"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={removeSelectedFile}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-red-600"
                title="Remove file"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* =================================================
              UPLOAD BUTTON
          ================================================= */}

          <button
            type="button"
            disabled={uploading}
            onClick={handleUploadClick}
            className="mt-4 w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "Upload Selected File"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;