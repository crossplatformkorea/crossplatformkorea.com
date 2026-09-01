import React, { KeyboardEvent, FormEvent, ReactNode } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import { TFunction } from 'i18next';
import { Button } from '@/components/uis/Button';

interface ProfileDetailsProps {
  formValues: {
    displayName: string;
    description: string;
    lookingFor: string;
    expectations: string;
    realName: string;
    organization: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  socialLinks: string[];
  updateSocialLink: (index: number, value: string) => void;
  removeSocialLink: (index: number) => void;
  addSocialLink: () => void;
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  handleTagKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  getSocialIcon: (url: string) => ReactNode;
  handleSaveProfile: (e: FormEvent<HTMLFormElement>) => void;
  t: TFunction;
}

export default function ProfileDetails({
  formValues,
  handleInputChange,
  socialLinks,
  updateSocialLink,
  removeSocialLink,
  addSocialLink,
  tags,
  tagInput,
  setTagInput,
  handleTagKeyDown,
  addTag,
  removeTag,
  getSocialIcon,
  handleSaveProfile,
  t,
}: ProfileDetailsProps) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        {t('profile.sections.details')}
      </h2>

      <form id="profileForm" onSubmit={handleSaveProfile} className="space-y-4">
        {/* Social Media Links - Updated for better mobile responsiveness */}
        <div>
          <label className="field-label">{t('profile.fields.socialLinks.label')}</label>
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 w-full">
                <div className="relative flex-1 min-w-0 w-full sm:w-auto">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {getSocialIcon(link)}
                  </div>
                  <div className="flex items-center w-full bg-background border border-border/50 rounded-md focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                    <span className="pl-10 pr-0 py-2 text-muted-foreground text-sm whitespace-nowrap">
                      https://
                    </span>
                    <input
                      type="text"
                      placeholder={t('profile.fields.socialLinks.placeholder', {
                        num: index + 1,
                      })}
                      value={link.replace(/^https?:\/\//i, '')}
                      onChange={(e) => updateSocialLink(index, e.target.value)}
                      className="flex-1 min-w-0 pl-0 pr-3 py-2 bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
                {socialLinks.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(index)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {socialLinks.length < 10 && (
              <Button
                variant="ghost"
                onClick={addSocialLink}
                className="mt-2 flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('profile.fields.socialLinks.addMore', {
                  count: socialLinks.length,
                  max: 10,
                })}
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="field-label">{t('profile.fields.tags.label')}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
              >
                <span>{tag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary hover:text-primary/80 p-0 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => {
                if (tagInput.trim()) {
                  addTag(tagInput);
                }
              }}
              placeholder={t('profile.fields.tags.placeholder')}
              className="field-control h-11"
            />
            {tagInput.trim() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addTag(tagInput)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 p-1 h-auto"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
          <input type="hidden" name="tags" value={tags.join(',')} />
          <p className="text-xs text-muted-foreground mt-1">{t('profile.fields.tags.help')}</p>
        </div>

        <div>
          <label className="field-label">{t('profile.fields.lookingFor.label')}</label>
          <input
            type="text"
            name="lookingFor"
            placeholder={t('profile.fields.lookingFor.placeholder')}
            value={formValues.lookingFor}
            onChange={handleInputChange}
            className="field-control h-11"
          />
        </div>

        <div>
          <label className="field-label">{t('profile.fields.description.label')}</label>
          <textarea
            name="description"
            placeholder={t('profile.fields.description.placeholder')}
            value={formValues.description}
            onChange={handleInputChange}
            rows={3}
            className="field-control min-h-28 resize-none py-3"
          />
        </div>

        <div>
          <label className="field-label">{t('profile.fields.expectations.label')}</label>
          <textarea
            name="expectations"
            placeholder={t('profile.fields.expectations.placeholder')}
            value={formValues.expectations}
            onChange={handleInputChange}
            rows={3}
            className="field-control min-h-28 resize-none py-3"
          />
        </div>
      </form>
    </div>
  );
}
