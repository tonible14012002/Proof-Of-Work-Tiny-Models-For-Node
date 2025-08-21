


export const formatReadableFileSize = (size?: number) => {
  if (!size) return "Unknown";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB"][i]}`;
};

