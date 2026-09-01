import React, { useEffect, useState, useRef, KeyboardEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useConvexAuth } from 'convex/react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAuthActions } from '@convex-dev/auth/react';
import { devConsole } from '@/lib/utils';
// Import translation utility for error messages
import { LogOut, Globe, Link as LinkIcon, LucideLinkedin, ArrowLeft } from 'lucide-react';
// 브랜드 아이콘 가져오기
import {
  SiGithub,
  SiX,
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiMedium,
  SiVelog,
  SiGmail,
  SiBlogger,
} from '@icons-pack/react-simple-icons';
import { t } from 'i18next';
import ProfileDisplay from './ProfileDisplay';
import ProfileDetails from './ProfileDetails';
import ProfileStats from './ProfileStats';
import PushNotificationSettings from './PushNotificationSettings';
import { useAuthStore } from '@/stores/authStore'; // Added
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/uis/Button';
import { getLocale } from '../../../lib/i18n';
import PageHeader from '@/components/uis/PageHeader';

export default function ProfilePage() {
  // const { isAuthenticated, isLoading } = useConvexAuth();
  const { isAuthenticated, isLoading, requireAuth } = useAuthStore(); // Added
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Refs for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for profile image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Track original avatar storage ID for deletion if needed
  const [originalAvatarStorageId, setOriginalAvatarStorageId] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  // State for social links
  const [socialLinks, setSocialLinks] = useState<string[]>([]);

  // State for tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth();
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  const currentUser = useQuery(api.users.query.currentUser);

  // Create user profile if it doesn't exist
  const createOrUpdateUser = useMutation(api.users.mutation.createOrUpdateUser);
  // Update file upload functions
  const generateUploadUrl = useMutation(api.files.mutation.generateUploadUrl);
  const saveFileMetadata = useMutation(api.files.mutation.saveFileMetadata);
  const deleteFile = useAction(api.files.action.deleteFileByStorageId);
  const updateProfile = useMutation(api.users.mutation.updateProfile);

  // State for saving profile
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // State for username validation
  const [hasUsernameError, setHasUsernameError] = useState(false);

  // Add state to track original profile data
  const [originalData, setOriginalData] = useState({
    displayName: '',
    description: '',
    lookingFor: '',
    expectations: '',
    realName: '',
    organization: '',
    socialLinks: [''],
    tags: [] as string[],
  });

  // Function to check if profile has been modified
  const hasProfileChanged = () => {
    // Check if any text field has changed
    const formChanged =
      formValues.displayName !== originalData.displayName ||
      formValues.description !== originalData.description ||
      formValues.lookingFor !== originalData.lookingFor ||
      formValues.expectations !== originalData.expectations ||
      formValues.realName !== originalData.realName ||
      formValues.organization !== originalData.organization;

    // Check if tags have changed (length or content)
    const tagsChanged =
      tags.length !== originalData.tags.length ||
      tags.some((tag) => !originalData.tags.includes(tag));

    // Check if social links have changed
    const filteredCurrentLinks = socialLinks.filter(
      (link) => link && link.trim() !== '' && link !== 'https://' && link !== 'http://',
    );
    const filteredOriginalLinks = originalData.socialLinks.filter(
      (link) => link && link.trim() !== '' && link !== 'https://' && link !== 'http://',
    );

    const linksChanged =
      filteredCurrentLinks.length !== filteredOriginalLinks.length ||
      filteredCurrentLinks.some((link, i) => filteredOriginalLinks[i] !== link);

    // Add check for image deletion
    return formChanged || tagsChanged || linksChanged || selectedImage !== null || isImageDeleted;
  };

  // Set image preview when user has an avatar and initialize social links and tags
  useEffect(() => {
    if (currentUser?.avatarUrl) {
      setImagePreview(currentUser.avatarUrl);
    }

    // Store original avatar storage ID for potential deletion
    if (currentUser?.profile?.avatarUrl) {
      setOriginalAvatarStorageId(currentUser.profile.avatarUrl);
    }

    // Initialize social links from user profile
    if (currentUser?.profile?.socialLinks && currentUser.profile.socialLinks.length > 0) {
      setSocialLinks(currentUser.profile.socialLinks);
    } else {
      // Start with one empty link if none exist
      setSocialLinks(['']);
    }

    // Initialize tags from user profile
    if (currentUser?.profile?.tags && currentUser.profile.tags.length > 0) {
      setTags(currentUser.profile.tags);
    }

    // Save original data for change detection
    if (currentUser?.profile) {
      setOriginalData({
        displayName: currentUser.profile.displayName || '',
        description: currentUser.profile.description || '',
        lookingFor: currentUser.profile.lookingFor || '',
        expectations: currentUser.profile.expectations || '',
        realName: currentUser.profile.name || '',
        organization: currentUser.profile.organization || '',
        socialLinks: currentUser.profile.socialLinks || [''],
        tags: currentUser.profile.tags || [],
      });
    }
  }, [currentUser?.avatarUrl, currentUser?.profile]);

  // Check if user is authenticated but doesn't have a profile
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (isAuthenticated && currentUser && !currentUser.profile && currentUser.email) {
        try {
          // Create a profile using the email from the authenticated user
          await createOrUpdateUser({
            email: currentUser.email,
            name: currentUser.name || currentUser.email.split('@')[0],
          });
          // Refresh the page to load the new profile
          window.location.reload();
        } catch (error) {
          devConsole.error('Failed to create user profile:', error);
        }
      }
    };

    void createProfileIfNeeded();
  }, [isAuthenticated, currentUser, createOrUpdateUser]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected image - updated to handle both selected and existing images
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setIsImageDeleted(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add a new social link field
  const addSocialLink = () => {
    if (socialLinks.length < 10) {
      // Maximum 10 links
      setSocialLinks([...socialLinks, '']);
    }
  };

  // Remove a social link field
  const removeSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  // Get the appropriate icon for a social media URL
  const getSocialIcon = (url: string) => {
    if (!url) return <Globe className="w-4 h-4" />;

    try {
      // Try to extract the domain from the URL
      let domain = url.toLowerCase();
      if (!domain.startsWith('http')) {
        domain = 'https://' + domain;
      }

      const urlObj = new URL(domain);
      const hostname = urlObj.hostname;

      // Check for common social media platforms
      if (hostname.includes('github.com')) {
        return <SiGithub size={16} />;
      } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return <SiX size={16} />;
      } else if (hostname.includes('facebook.com')) {
        return <SiFacebook size={16} />;
      } else if (hostname.includes('linkedin.com')) {
        return <LucideLinkedin className="w-4 h-4" />;
      } else if (hostname.includes('instagram.com')) {
        return <SiInstagram size={16} />;
      } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return <SiYoutube size={16} />;
      } else if (hostname.includes('medium.com')) {
        return <SiMedium size={16} />;
      } else if (hostname.includes('velog.io')) {
        return <SiVelog size={16} />;
      } else if (hostname.includes('blogger') || hostname.includes('blog')) {
        return <SiBlogger size={16} />;
      } else if (hostname.includes('mail') || hostname.includes('gmail')) {
        return <SiGmail size={16} />;
      } else {
        return <Globe className="w-4 h-4" />;
      }
    } catch {
      // If URL parsing fails, return a default icon
      return <LinkIcon className="w-4 h-4" />;
    }
  };

  // Add form state to track input values
  const [formValues, setFormValues] = useState({
    displayName: '',
    description: '',
    lookingFor: '',
    expectations: '',
    realName: '',
    organization: '',
  });

  // Update form state when user data is loaded
  useEffect(() => {
    if (currentUser?.profile) {
      setFormValues({
        displayName: currentUser.profile.displayName || '',
        description: currentUser.profile.description || '',
        lookingFor: currentUser.profile.lookingFor || '',
        expectations: currentUser.profile.expectations || '',
        realName: currentUser.profile.name || '',
        organization: currentUser.profile.organization || '',
      });
    }
  }, [currentUser?.profile]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hide success message when user starts editing again
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  // Update a social link field - fixed version
  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];

    // Remove any existing protocol prefix first to avoid duplicates
    const cleanValue = value.replace(/^https?:\/\//i, '');

    // Only add https:// if the value isn't empty
    if (cleanValue) {
      newLinks[index] = `https://${cleanValue}`;
    } else {
      newLinks[index] = '';
    }

    setSocialLinks(newLinks);

    // Hide success message when user modifies links
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  // Add a new tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);

      // Hide success message when user adds tags
      if (saveSuccess) {
        setSaveSuccess(false);
      }
    }
    setTagInput('');
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));

    // Hide success message when user removes tags
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  // Handle tag input key down
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = tagInput.replace(/,/g, '').trim();
      if (value) {
        addTag(value);
      }
    }
  };

  // Function to save profile data - updated to use avatarUrl instead of avatarUrlId
  const saveProfileData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const { displayName, description, lookingFor, expectations, realName, organization } =
        formValues;

      // Validate required fields
      if (!displayName || displayName.trim() === '') {
        setSaveError(t('profile.errors.displayNameRequired'));
        setIsSaving(false);
        return;
      }

      // Filter valid social links
      const filteredSocialLinks = socialLinks.filter((link) => {
        // Make sure empty links and links that are just protocols are excluded
        return link && link.trim() !== '' && link !== 'https://' && link !== 'http://';
      });

      // Handle image upload if there is a selected image
      let avatarUrl = currentUser?.profile?.avatarUrl;

      // If image was deleted, clear the avatarUrl
      if (isImageDeleted) {
        avatarUrl = undefined;

        // Delete the original image from storage if it exists
        if (originalAvatarStorageId) {
          try {
            await deleteFile({ storageId: originalAvatarStorageId as any });
          } catch (error) {
            devConsole.error('Error deleting old avatar:', error);
            // Continue with profile update even if deletion fails
          }
        }
      }
      // If there's a new image selected, upload it using the new method
      else if (selectedImage) {
        try {
          // Step 1: Generate upload URL
          const uploadUrl = await generateUploadUrl();

          // Step 2: POST the file to the URL
          const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': selectedImage.type },
            body: selectedImage,
          });

          const { storageId } = await result.json();

          // Step 3: Save the file metadata
          const fileResult = await saveFileMetadata({
            storageId,
            fileName: selectedImage.name,
            contentType: selectedImage.type,
          });

          if (fileResult.success) {
            // Use the URL directly instead of the storage ID
            avatarUrl = fileResult.url;

            // Delete the old avatar if it exists and is different
            if (originalAvatarStorageId) {
              try {
                await deleteFile({ storageId: originalAvatarStorageId as any });
              } catch (error) {
                devConsole.error('Error deleting old avatar:', error);
                // Continue with profile update even if deletion fails
              }
            }
          } else {
            throw new Error('Failed to save file metadata');
          }
        } catch (error) {
          devConsole.error('Error uploading image:', error);
          setSaveError(t('errors.general'));
          setIsSaving(false);
          return;
        }
      }

      // 현재 locale 가져오기
      const currentLocale = getLocale();

      // Update profile with new data including avatar URL and locale
      await updateProfile({
        displayName,
        description,
        avatarUrl, // Use URL directly instead of storageId
        githubId: currentUser?.profile?.githubId,
        socialLinks: filteredSocialLinks,
        tags,
        lookingFor,
        expectations,
        locale: currentLocale,
      });

      // Also update basic user info
      const userData = {
        email: currentUser?.profile?.email || '',
        name: realName,
        realName,
        displayName,
        organization,
        description,
        lookingFor,
        expectations,
        tags,
        socialLinks: filteredSocialLinks,
        locale: currentLocale,
      };

      // Submit to server with updated response handling
      const result = await createOrUpdateUser(userData);

      // Handle possible error from the server using errorCode
      if (result && !result.success) {
        // Use the translation system with the errorCode
        if (result.errorCode) {
          // Translate the error code using the i18n utility
          setSaveError(t(result.errorCode));
        } else {
          // Fallback error message
          setSaveError(t('errors.general'));
        }
        setIsSaving(false);
        return;
      }

      // Set success message (without timeout to clear it)
      setSaveSuccess(true);

      // Update original data to reflect the saved state
      setOriginalData({
        displayName: formValues.displayName,
        description: formValues.description,
        lookingFor: formValues.lookingFor,
        expectations: formValues.expectations,
        realName: formValues.realName,
        organization: formValues.organization,
        socialLinks: filteredSocialLinks,
        tags: [...tags],
      });

      // Reset selected image state after successful save
      setSelectedImage(null);
      setIsImageDeleted(false);

      // Update the original avatar storage ID for future reference
      if (avatarUrl) {
        setOriginalAvatarStorageId(avatarUrl);
      } else {
        setOriginalAvatarStorageId(null);
      }

      // Remove the page refresh - Convex will automatically update the UI with new data
      // window.location.reload(); - REMOVED THIS LINE
    } catch (error) {
      devConsole.error('Error saving profile:', error);
      setSaveError(t('errors.general'));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submit - void return type to satisfy ESLint
  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    void saveProfileData(e);
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setTimeout(() => {
        void navigate('/');
      }, 1000);
    } catch (error) {
      devConsole.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          eyebrow="MEMBER / SETTINGS"
          title={t('profile.title')}
          description={t('profile.sections.details')}
          action={
            <div className="flex items-center gap-2">
              <ThemeToggle className="block sm:hidden" />
              <Button
                onClick={() => void handleSignOut()}
                disabled={isSigningOut}
                variant="outline"
                className="text-destructive hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              >
                <LogOut size={16} />
                {isSigningOut ? t('common.loading') : t('profile.buttons.signOut')}
              </Button>
            </div>
          }
        />

        {/* Profile Image and Display Name Card */}
        <ProfileDisplay
          imagePreview={imagePreview}
          removeSelectedImage={removeSelectedImage}
          triggerFileInput={triggerFileInput}
          fileInputRef={fileInputRef}
          handleImageSelect={handleImageSelect}
          formValues={formValues}
          handleInputChange={handleInputChange}
          t={t}
          onUsernameValidationChange={setHasUsernameError}
        />

        {/* 사용자 통계 정보 추가 */}
        {currentUser && currentUser._id && (
          <ProfileStats userId={currentUser._id} className="mt-6" />
        )}

        {/* Profile Details Card */}
        <ProfileDetails
          formValues={formValues}
          handleInputChange={handleInputChange}
          socialLinks={socialLinks}
          updateSocialLink={updateSocialLink}
          removeSocialLink={removeSocialLink}
          addSocialLink={addSocialLink}
          tags={tags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          handleTagKeyDown={handleTagKeyDown}
          addTag={addTag}
          removeTag={removeTag}
          getSocialIcon={getSocialIcon}
          handleSaveProfile={handleSaveProfile}
          t={t}
        />

        {/* Push Notification Settings Card */}
        <div className="mt-6">
          <PushNotificationSettings />
        </div>

        {/* Action row with messages on left and buttons on right */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-16">
          {/* Success and error messages */}
          <div className="flex-1 mb-4 sm:mb-0">
            {saveSuccess && (
              <p className="text-green-500 text-sm">{t('profile.messages.saveSuccess')}</p>
            )}

            {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 w-full sm:w-auto">
            <Button
              onClick={() => void navigate(-1)}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              {t('common.buttons.cancel')}
            </Button>

            <Button
              type="submit"
              form="profileForm"
              disabled={isSaving || !hasProfileChanged() || hasUsernameError}
              className="flex items-center"
            >
              {isSaving ? t('common.buttons.saving') : t('common.buttons.save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
