import React, { RefObject, ChangeEvent, useState } from 'react';
import { User, X, Camera } from 'lucide-react';
import { TFunction } from 'i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/uis/Button';
import { validateUsername, normalizeUsername } from '@/utils/usernameValidation';

interface ProfileDisplayProps {
  imagePreview: string | null;
  removeSelectedImage: () => void;
  triggerFileInput: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  formValues: {
    displayName: string;
    realName: string;
    organization: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  t: TFunction;
  onUsernameValidationChange?: (hasError: boolean) => void;
}

export default function ProfileDisplay({
  imagePreview,
  removeSelectedImage,
  triggerFileInput,
  fileInputRef,
  handleImageSelect,
  formValues,
  handleInputChange,
  t,
  onUsernameValidationChange,
}: ProfileDisplayProps) {
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Handle displayName change with validation
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;

    // Normalize the value (replace spaces and special characters with hyphens)
    const normalizedValue = normalizeUsername(originalValue);

    // Update the input value with normalized value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: normalizedValue,
        name: 'displayName',
      },
    };

    // Call the original handler
    handleInputChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);

    // Validate username
    let hasError = false;
    if (normalizedValue.trim()) {
      const validation = validateUsername(normalizedValue);
      if (!validation.isValid && validation.error) {
        setUsernameError(t(validation.error));
        hasError = true;
      } else {
        setUsernameError(null);
      }
    } else {
      setUsernameError(null);
    }

    // Notify parent component about validation status
    onUsernameValidationChange?.(hasError);
  };
  return (
    <div className="border border-border/50 rounded-lg p-5 mb-6 bg-card/30">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image - added outer wrapper div with padding */}
        <div className="relative group pt-2 pr-2 pb-2 pl-2">
          {/* Delete button - made smaller and less obtrusive */}
          {imagePreview && (
            <Button
              variant="destructive"
              size="sm"
              onClick={removeSelectedImage}
              title={t('profile.buttons.removeImage')}
              className={cn(
                'absolute -top-1 -right-1 rounded-full p-1 shadow-md transition-all duration-200 z-10 border border-white w-6 h-6',
                'hover:scale-110',
              )}
              aria-label={t('profile.buttons.removeImage')}
            >
              <X className="w-3 h-3" />
            </Button>
          )}

          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}

            {/* Overlay for image upload */}
            <div
              className={cn(
                'absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 cursor-pointer',
                'group-hover:opacity-100 transition-opacity',
              )}
              onClick={triggerFileInput}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Profile Fields - Improved layout */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              {t('profile.fields.displayName.label')}
            </label>
            <input
              type="text"
              name="displayName"
              value={formValues.displayName}
              onChange={handleDisplayNameChange}
              required
              className={cn(
                'w-full px-3 py-2 bg-background/60 border border-border/50 rounded-md outline-none',
                'focus:border-primary/50 focus:ring-1 focus:ring-primary/50',
                usernameError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              )}
            />
            {usernameError && <p className="mt-1 text-sm text-red-500">{usernameError}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              {t('profile.fields.displayName.hint')}
            </p>
          </div>

          {/* 실명 (Real Name) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              {t('profile.fields.realName.label')}
            </label>
            <input
              type="text"
              name="realName"
              value={formValues.realName}
              onChange={handleInputChange}
              className={cn(
                'w-full px-3 py-2 bg-background/60 border border-border/50 rounded-md outline-none',
                'focus:border-primary/50 focus:ring-1 focus:ring-primary/50',
              )}
            />
          </div>

          {/* 소속 (Organization) - Takes full width on larger screens */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              {t('profile.fields.organization.label')}
            </label>
            <input
              type="text"
              name="organization"
              value={formValues.organization}
              onChange={handleInputChange}
              placeholder={t('profile.fields.organization.placeholder')}
              className={cn(
                'w-full px-3 py-2 bg-background/60 border border-border/50 rounded-md outline-none',
                'focus:border-primary/50 focus:ring-1 focus:ring-primary/50',
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
