import type { FileLoadInfo } from "@/schema/model";

export const getTotalFileInfo = (fileInfos: Record<string, FileLoadInfo>) => {
  const sumInfo = Object.entries(fileInfos).reduce(
    (acc, [_, info]) => {
      acc.totalDownloadTime += info.duration ?? 0;
      acc.totalSize += info.total ?? 0;
      acc.loadedSize += info.loaded ?? 0;
      return acc;
    },
    {
      totalSize: 0,
      loadedSize: 0,
      totalDownloadTime: 0,
    }
  );
  return sumInfo;
};
