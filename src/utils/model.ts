import type { FileLoadInfo } from "@/schema/model";

export const getTotalFileInfo = (fileLoadInfo: Record<string, FileLoadInfo>) => {
  const files = Object.values(fileLoadInfo);
  const totalSize = files.reduce((acc, file) => acc + file.total, 0);
  const loadedSize = files.reduce((acc, file) => acc + file.loaded, 0);
  const totalDownloadTime = files.reduce((acc, file) => acc + file.duration, 0);

  return {
    totalSize,
    loadedSize,
    totalDownloadTime,
  };
};
