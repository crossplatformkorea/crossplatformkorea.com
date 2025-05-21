import React, { useEffect, useState, useRef, KeyboardEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuthActions } from '@convex-dev/auth/react';
import { cn } from '@/lib/utils';
// Import translation utility for error messages
import {
  User,
  LogOut,
  Settings,
  Camera,
  X,
  Plus,
  Trash2,
  Globe,
  Link as LinkIcon,
  LucideLinkedin,
  ArrowLeft,
} from 'lucide-react';
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

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
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
      void navigate('/sign-in');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Get current user data
  const userIdentity = useQuery(api.users.currentUser);

  // Create user profile if it doesn't exist
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  // Update file upload functions
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFileMetadata = useMutation(api.files.saveFileMetadata);
  const deleteFile = useAction(api.files.deleteFileByStorageId);
  const updateProfile = useMutation(api.users.updateProfile);

  // State for saving profile
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
    if (userIdentity?.avatarUrl) {
      setImagePreview(userIdentity.avatarUrl);
    }

    // Store original avatar storage ID for potential deletion
    if (userIdentity?.profile?.avatarUrlId) {
      setOriginalAvatarStorageId(userIdentity.profile.avatarUrlId);
    }

    // Initialize social links from user profile
    if (userIdentity?.profile?.socialLinks && userIdentity.profile.socialLinks.length > 0) {
      setSocialLinks(userIdentity.profile.socialLinks);
    } else {
      // Start with one empty link if none exist
      setSocialLinks(['']);
    }

    // Initialize tags from user profile
    if (userIdentity?.profile?.tags && userIdentity.profile.tags.length > 0) {
      setTags(userIdentity.profile.tags);
    }

    // Save original data for change detection
    if (userIdentity?.profile) {
      setOriginalData({
        displayName: userIdentity.profile.displayName || '',
        description: userIdentity.profile.description || '',
        lookingFor: userIdentity.profile.lookingFor || '',
        expectations: userIdentity.profile.expectations || '',
        realName: userIdentity.profile.name || '',
        organization: userIdentity.profile.organization || '',
        socialLinks: userIdentity.profile.socialLinks || [''],
        tags: userIdentity.profile.tags || [],
      });
    }
  }, [userIdentity?.avatarUrl, userIdentity?.profile]);

  // Check if user is authenticated but doesn't have a profile
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (isAuthenticated && userIdentity && !userIdentity.profile && userIdentity.email) {
        try {
          // Create a profile using the email from the authenticated user
          await createOrUpdateUser({
            email: userIdentity.email,
            name: userIdentity.name || userIdentity.email.split('@')[0],
          });
          // Refresh the page to load the new profile
          window.location.reload();
        } catch (error) {
          console.error('Failed to create user profile:', error);
        }
      }
    };

    void createProfileIfNeeded();
  }, [isAuthenticated, userIdentity, createOrUpdateUser]);

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
    if (userIdentity?.profile) {
      setFormValues({
        displayName: userIdentity.profile.displayName || '',
        description: userIdentity.profile.description || '',
        lookingFor: userIdentity.profile.lookingFor || '',
        expectations: userIdentity.profile.expectations || '',
        realName: userIdentity.profile.name || '',
        organization: userIdentity.profile.organization || '',
      });
    }
  }, [userIdentity?.profile]);

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

  // Function to save profile data - updated to avoid page refresh
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
      let avatarUrlId = userIdentity?.profile?.avatarUrlId;

      // If image was deleted, clear the avatarUrlId
      if (isImageDeleted) {
        avatarUrlId = undefined;

        // Delete the original image from storage if it exists
        if (originalAvatarStorageId) {
          try {
            await deleteFile({ storageId: originalAvatarStorageId as any });
          } catch (error) {
            console.error('Error deleting old avatar:', error);
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
            avatarUrlId = fileResult.storageId;

            // Delete the old avatar if it exists and is different
            if (originalAvatarStorageId && originalAvatarStorageId !== fileResult.storageId) {
              try {
                await deleteFile({ storageId: originalAvatarStorageId as any });
              } catch (error) {
                console.error('Error deleting old avatar:', error);
                // Continue with profile update even if deletion fails
              }
            }
          } else {
            throw new Error('Failed to save file metadata');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setSaveError(t('errors.general'));
          setIsSaving(false);
          return;
        }
      }

      // Update profile with new data including avatar ID
      await updateProfile({
        displayName,
        description,
        avatarUrlId: avatarUrlId as any,
        githubId: userIdentity?.profile?.githubId,
        socialLinks: filteredSocialLinks,
        tags,
        lookingFor,
        expectations,
      });

      // Also update basic user info
      const userData = {
        email: userIdentity?.profile?.email || '',
        name: realName,
        realName,
        displayName,
        organization,
        description,
        lookingFor,
        expectations,
        tags,
        socialLinks: filteredSocialLinks,
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
      if (avatarUrlId) {
        setOriginalAvatarStorageId(avatarUrlId);
      } else {
        setOriginalAvatarStorageId(null);
      }

      // Remove the page refresh - Convex will automatically update the UI with new data
      // window.location.reload(); - REMOVED THIS LINE
    } catch (error) {
      console.error('Error saving profile:', error);
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
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header with Sign Out button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <User className="w-6 h-6 mr-2 text-primary" />
              {t('profile.title')}
            </h1>

            <button
              type="button"
              onClick={() => {
                void handleSignOut();
              }}
              disabled={isSigningOut}
              className={cn(
                'px-3 py-1.5 rounded-md transition-colors flex items-center',
                'bg-red-500/10 text-red-500 hover:bg-red-500/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <LogOut size={16} className="mr-1" />
              {isSigningOut ? t('common.loading') : t('profile.buttons.signOut')}
            </button>
          </div>

          {/* Profile Image and Display Name Card */}
          <div className="border border-border/50 rounded-lg p-5 mb-6 bg-card/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image - added outer wrapper div with padding */}
              <div className="relative group pt-2 pr-2 pb-2 pl-2">
                {/* Delete button - made smaller and less obtrusive */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    title={t('profile.buttons.removeImage')}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-all duration-200 hover:scale-110 z-10 border border-white"
                    aria-label={t('profile.buttons.removeImage')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}

                  {/* Overlay for image upload */}
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-background/60 border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                  />
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
                    className="w-full px-3 py-2 bg-background/60 border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
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
                    className="w-full px-3 py-2 bg-background/60 border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="border border-border/50 rounded-lg p-5 bg-card/30">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t('profile.sections.details')}
            </h2>

            <form id="profileForm" onSubmit={handleSaveProfile} className="space-y-4">
              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  {t('profile.fields.socialLinks.label')}
                </label>
                <div className="space-y-2">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {getSocialIcon(link)}
                        </div>
                        <div className="flex items-center w-full bg-background border border-border/50 rounded-md focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                          <span className="pl-10 pr-0 py-2 text-muted-foreground">https://</span>
                          <input
                            type="text"
                            placeholder={t('profile.fields.socialLinks.placeholder', {
                              num: index + 1,
                            })}
                            value={link.replace(/^https?:\/\//i, '')}
                            onChange={(e) => updateSocialLink(index, e.target.value)}
                            className="flex-1 pl-0 pr-3 py-2 bg-transparent border-none outline-none"
                          />
                        </div>
                      </div>
                      {socialLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {socialLinks.length < 10 && (
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="mt-2 flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t('profile.fields.socialLinks.addMore', {
                        count: socialLinks.length,
                        max: 10,
                      })}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  {t('profile.fields.tags.label')}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-primary hover:text-primary/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
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
                    className="w-full px-3 py-2 bg-background border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                  />
                  {tagInput.trim() && (
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input type="hidden" name="tags" value={tags.join(',')} />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('profile.fields.tags.help')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  {t('profile.fields.lookingFor.label')}
                </label>
                <input
                  type="text"
                  name="lookingFor"
                  placeholder={t('profile.fields.lookingFor.placeholder')}
                  value={formValues.lookingFor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  {t('profile.fields.description.label')}
                </label>
                <textarea
                  name="description"
                  placeholder={t('profile.fields.description.placeholder')}
                  value={formValues.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  {t('profile.fields.expectations.label')}
                </label>
                <textarea
                  name="expectations"
                  placeholder={t('profile.fields.expectations.placeholder')}
                  value={formValues.expectations}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border/50 rounded-md focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                />
              </div>
            </form>
          </div>

          {/* Action row with messages on left and buttons on right */}
          <div className="flex justify-between items-center mt-6">
            {/* Success and error messages */}
            <div className="flex-1">
              {saveSuccess && (
                <p className="text-green-500 text-sm">{t('profile.messages.saveSuccess')}</p>
              )}

              {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => void navigate(-1)}
                className={cn(
                  'px-5 py-2.5 rounded-md border border-border/50 bg-background',
                  'text-muted-foreground hover:bg-muted/30 transition-colors flex items-center',
                )}
              >
                <ArrowLeft size={16} className="mr-1.5" />
                {t('common.buttons.cancel')}
              </button>

              <button
                type="submit"
                form="profileForm"
                disabled={isSaving || !hasProfileChanged()}
                className={cn(
                  'px-5 py-2.5 rounded-md',
                  'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                  'flex items-center',
                  (isSaving || !hasProfileChanged()) && 'opacity-70 cursor-not-allowed',
                )}
              >
                {isSaving ? t('common.buttons.saving') : t('common.buttons.save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
