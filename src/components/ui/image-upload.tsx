import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { t } from "../../lib/i18n";

export interface ImageUploadProps {
  onChange: (file: File | null) => void;
  selectedFile: File | null;
  className?: string;
  disabled?: boolean;
  accept?: string;
}

export function ImageUpload({
  onChange,
  selectedFile,
  className,
  disabled = false,
  accept = "image/*",
}: ImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className={cn("border border-input rounded-md p-4 bg-background/60", className)}>
      <input
        type="file"
        accept={accept}
        onChange={handleImageChange}
        className={cn(
          "block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md",
          "file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary",
          "hover:file:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        )}
        disabled={disabled}
      />
      {selectedFile && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-input">
          <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
          <Button
            onClick={() => onChange(null)}
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={disabled}
          >
            {t('common.remove')}
          </Button>
        </div>
      )}
    </div>
  );
}
