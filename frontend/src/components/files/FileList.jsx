import FileCard from "./FileCard";

const FileList = ({
  files = [],
  loading = false,
  onDelete,
  onUpdate,
  onPreview,
  updatingFileId = null,
}) => {
  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-purple-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading files...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!files.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
          </div>

          <h3 className="text-base font-semibold text-slate-700">
            No files uploaded yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Project files will appear here.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // FILE GRID
  // =====================================================

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => {
        if (!file?._id) {
          return null;
        }

        const isUpdating =
          updatingFileId?.toString() ===
          file._id?.toString();

        return (
          <FileCard
            key={file._id}
            file={file}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onPreview={onPreview}
            updating={isUpdating}
          />
        );
      })}
    </div>
  );
};

export default FileList;