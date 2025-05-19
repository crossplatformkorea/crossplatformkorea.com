import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { ImageUpload } from "./ui/image-upload";
import { Slider } from "./ui/slider";
import { Tooltip } from "./ui/tooltip";
import { t } from "../lib/i18n";

export type Veo2AspectRatio = "16:9" | "9:16";
export type PersonGeneration = "dont_allow" | "allow_adult";

interface PromptMenuVeo2Props {
  isLoading: boolean;
  onGenerate: (params: {
    prompt: string;
    aspectRatio: Veo2AspectRatio;
    durationSeconds: number;
    imageBytes?: string;
    personGeneration: PersonGeneration;
  }) => Promise<void>;
}

export default function PromptMenuVeo2({
  isLoading,
  onGenerate,
}: PromptMenuVeo2Props) {
  // Internal state management
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [videoLength, setVideoLength] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<Veo2AspectRatio>("16:9");
  const [personGeneration, setPersonGeneration] = useState<PersonGeneration>("dont_allow");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (_: MouseEvent) => {
      if (activeTooltip) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTooltip]);

  const handleTooltipToggle = (tooltipName: string) => {
    setActiveTooltip(activeTooltip === tooltipName ? null : tooltipName);
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    try {
      let imageBytes: string | undefined = undefined;
      if (selectedImage) {
        const buffer = await selectedImage.arrayBuffer();
        imageBytes = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
      }

      await onGenerate({
        prompt,
        aspectRatio,
        durationSeconds: videoLength,
        imageBytes,
        personGeneration,
      });

      // Reset form after successful generation
      setPrompt("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error in Veo2 generation:", error);
    }
  };

  const tooltips = {
    prompt: t("promptMenu.tooltips.prompt"),
    negativePrompt: t("promptMenu.tooltips.negativePrompt"),
    image: t("promptMenu.tooltips.image"),
    personGeneration: t("promptMenu.tooltips.personGeneration"),
    videoLength: t("promptMenu.tooltips.videoLength"),
    aspectRatio: t("promptMenu.tooltips.aspectRatio"),
  };

  const aspectRatioOptions = [
    { value: "16:9", label: t("promptMenu.options.landscape") },
    { value: "9:16", label: t("promptMenu.options.portrait") },
  ];

  const personGenerationOptions = [
    { value: "dont_allow", label: t("promptMenu.options.dontAllowPeople") },
    { value: "allow_adult", label: t("promptMenu.options.allowAdults") },
  ];

  return (
    <div className="space-y-6">
      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t("promptMenu.veo2.prompt")}
          <Tooltip
            content={tooltips.prompt}
            isOpen={activeTooltip === "prompt"}
            onToggle={() => handleTooltipToggle("prompt")}
          />
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("promptMenu.veo2.promptPlaceholder")}
          rows={4}
          disabled={isLoading}
          className="resize-none focus-visible:ring-offset-2"
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t("promptMenu.veo2.negativePrompt")}
          <Tooltip
            content={tooltips.negativePrompt}
            isOpen={activeTooltip === "negativePrompt"}
            onToggle={() => handleTooltipToggle("negativePrompt")}
          />
        </label>
        <Textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder={t("promptMenu.veo2.negativePromptPlaceholder")}
          rows={2}
          disabled={isLoading}
          className="resize-none focus-visible:ring-offset-2"
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t("promptMenu.veo2.image")}
          <Tooltip
            content={tooltips.image}
            isOpen={activeTooltip === "image"}
            onToggle={() => handleTooltipToggle("image")}
          />
        </label>
        <ImageUpload
          onChange={setSelectedImage}
          selectedFile={selectedImage}
          disabled={isLoading}
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t("promptMenu.veo2.personGeneration")}
          <Tooltip
            content={tooltips.personGeneration}
            isOpen={activeTooltip === "personGeneration"}
            onToggle={() => handleTooltipToggle("personGeneration")}
          />
        </label>
        <Select
          value={personGeneration}
          onChange={(e) => setPersonGeneration(e.target.value as PersonGeneration)}
          options={personGenerationOptions}
          disabled={isLoading}
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t("promptMenu.veo2.aspectRatio")}
          <Tooltip
            content={tooltips.aspectRatio}
            isOpen={activeTooltip === "aspectRatio"}
            onToggle={() => handleTooltipToggle("aspectRatio")}
          />
        </label>
        <Select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as Veo2AspectRatio)}
          options={aspectRatioOptions}
          disabled={isLoading}
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t("promptMenu.veo2.videoLength")}
          <Tooltip
            content={tooltips.videoLength}
            isOpen={activeTooltip === "videoLength"}
            onToggle={() => handleTooltipToggle("videoLength")}
          />
        </label>
        <Slider
          min={5}
          max={8}
          value={videoLength}
          onChange={setVideoLength}
          formatValue={(value) => `${value} ${t("promptMenu.veo2.seconds")}`}
          minLabel="5s"
          maxLabel="8s"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={() => void handleGenerateVideo()}
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary/90 hover:to-primary/80 transition-all shadow-lg shadow-primary/20"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {t('video.generating')}
          </span>
        ) : (
          t('video.generateVideo')
        )}
      </button>
    </div>
  );
}
