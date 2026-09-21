import { X } from "lucide-react";

const FilePreview = ({
  file,
  onClose,
}) => {
  if (!file) return null;

  const url =
    file.fileUrl ||
    file.url;

  const type =
    file.fileType ||
    file.mimetype ||
    "";

  const isImage =
    type.startsWith("image/");

  const isPdf =
    type.includes("pdf");

  const isVideo =
    type.startsWith("video/");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold truncate">
            {file.originalName || file.name}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-auto">
          {isImage && (
            <img
              src={url}
              alt={file.originalName}
              className="max-w-full mx-auto"
            />
          )}

          {isPdf && (
            <iframe
              src={url}
              title={file.originalName}
              className="w-full h-[70vh]"
            />
          )}

          {isVideo && (
            <video
              src={url}
              controls
              className="w-full max-h-[70vh]"
            />
          )}

          {!isImage &&
            !isPdf &&
            !isVideo && (
              <div className="text-center py-10">
                <p className="text-slate-500">
                  Preview is not available for
                  this file type.
                </p>

                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Open File
                </a>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;