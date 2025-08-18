import type { ReactNode } from "react";

interface ModelGroupProps {
  title: string;
  listEl?: ReactNode;
}

export const ModelGroup = (props: ModelGroupProps) => {
  const { title, listEl } = props;
  return (
    <div className="space-y-2">
      <h4 className="text-xs text-muted-foreground truncate">{title}</h4>
      {listEl}
    </div>
  );
};
