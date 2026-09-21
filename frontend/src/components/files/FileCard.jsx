import {
  File,
  Trash2,
  ExternalLink,
  Pencil,
  Loader2,
} from "lucide-react";

import { useRef } from "react";

const FileCard = ({
  file,
  onDelete,
  onUpdate,
  onPreview,
  updating = false,
}) => {
  const fileInputRef = useRef(null);

  // =====================================================
  // PERMISSIONS
  // =====================================================

  const canDelete =
    typeof onDelete === "function";

  const canUpdate =
    typeof onUpdate === "function";

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = () => {
    if (!canDelete || !file?._id || updating) {
      return;
    }

    onDelete(file._id);
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const handlePreview = () => {
    if (
      !file ||
      typeof onPreview !== "function"
    ) {
      return;
    }

    onPreview(file);
  };

  // =====================================================
  // OPEN FILE SELECTOR
  // =====================================================

  const handleUpdateClick = () => {
    if (
      !canUpdate ||
      updating
    ) {
      return;
    }

    fileInputRef.current?.click();
  };

  // =====================================================
  // FILE SELECTED
  // =====================================================

  const handleFileChange = async (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    /*
     * User opened file picker but
     * didn't select anything.
     */

    if (!selectedFile) {
      return;
    }

    if (
      !canUpdate ||
      !file?._id ||
      updating
    ) {
      event.target.value = "";
      return;
    }

    try {
      await onUpdate(
        file._id,
        selectedFile
      );
    } finally {
      /*
       * Reset input so the same file
       * can be selected again later.
       */

      event.target.value = "";
    }
  };

  // =====================================================
  // FILE NAME
  // =====================================================

  const fileName =
    file?.originalName ||
    file?.name ||
    "Unnamed file";

  // =====================================================
  // FILE TYPE
  // =====================================================

  const fileType =
    file?.fileType ||
    file?.mimetype ||
    file?.mimeType ||
    "File";

  // =====================================================
  // FILE SIZE
  // =====================================================

  const formatFileSize = (bytes) => {
    if (
      !bytes ||
      Number(bytes) <= 0
    ) {
      return null;
    }

    const size =
      Number(bytes);

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(
        size / 1024
      ).toFixed(1)} KB`;
    }

    if (
      size <
      1024 * 1024 * 1024
    ) {
      return `${(
        size /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${(
      size /
      (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
  };

  const fileSize =
    formatFileSize(
      file?.size
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${
        updating
          ? "opacity-80"
          : ""
      }`}
    >
      {/* =================================================
          FILE INFO
      ================================================= */}

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <File
            size={19}
            className="text-slate-600"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate font-medium text-slate-900"
            title={fileName}
          >
            {fileName}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <p className="truncate text-xs text-slate-500">
              {fileType}
            </p>

            {fileSize && (
              <>
                <span className="text-slate-300">
                  •
                </span>

                <p className="shrink-0 text-xs text-slate-500">
                  {fileSize}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          HIDDEN FILE INPUT
      ================================================= */}

      {canUpdate && (
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={updating}
        />
      )}

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="mt-4 flex gap-2">
        {/* PREVIEW */}

        <button
          type="button"
          onClick={handlePreview}
          disabled={updating}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ExternalLink size={15} />

          Preview
        </button>

        {/* UPDATE / REPLACE */}

        {canUpdate && (
          <button
            type="button"
            onClick={handleUpdateClick}
            disabled={updating}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
            title="Replace file"
          >
            {updating ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                <span className="hidden sm:inline">
                  Updating
                </span>
              </>
            ) : (
              <>
                <Pencil size={17} />

                <span className="hidden sm:inline">
                  Replace
                </span>
              </>
            )}
          </button>
        )}

        {/* DELETE */}

        {canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={updating}
            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete file"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>

      {/* =================================================
          UPDATE STATUS
      ================================================= */}

      {updating && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
          <Loader2
            size={15}
            className="animate-spin text-purple-600"
          />

          <span className="text-xs font-medium text-purple-700">
            Replacing file...
          </span>
        </div>
      )}
    </div>
  );
};

export default FileCard;