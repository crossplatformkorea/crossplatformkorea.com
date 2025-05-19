import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { RadioGroup } from "./ui/radio-group";
import { ImageUpload } from "./ui/image-upload";
import { cn } from "../lib/utils";
import { Tooltip } from "./ui/tooltip";
import { t } from "../lib/i18n";

export type RunwayGen4TurboAspectRatio = 
  | "1280:720"
  | "720:1280"
  | "1104:832"
  | "832:1104"
  | "960:960"
  | "1584:672";

interface PromptMenuRunwayGen4TurboProps {
  isLoading: boolean;
  onGenerate: (params: {
    prompt: string;
    ratio: RunwayGen4TurboAspectRatio;
    duration: 5 | 10;
    seed?: number;
    imageBytes: string;
  }) => Promise<void>;
}

export default function PromptMenuRunwayGen4Turbo({
  isLoading,
  onGenerate,
}: PromptMenuRunwayGen4TurboProps) {
  // Internal state management
  const [prompt, setPrompt] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [videoLength, setVideoLength] = useState<5 | 10>(5);
  const [aspectRatio, setAspectRatio] = useState<RunwayGen4TurboAspectRatio>("1280:720");
  const [seed, setSeed] = useState<number | undefined>();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Close tooltip when clicking outside
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
    if (!prompt.trim() || !selectedImage) return;

    try {
      const buffer = await selectedImage.arrayBuffer();
      const imageBytes = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      await onGenerate({
        prompt,
        ratio: aspectRatio,
        duration: videoLength,
        seed,
        imageBytes,
      });

      // Reset form after successful generation
      setPrompt("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error in Runway generation:", error);
    }
  };

  const tooltips = {
    prompt: t('promptMenu.tooltips.promptRunway'),
    image: t('promptMenu.tooltips.imageRunway'),
    seed: t('promptMenu.tooltips.seed'),
    videoLength: t('promptMenu.tooltips.videoLengthRunway'),
    aspectRatio: t('promptMenu.tooltips.aspectRatioRunway'),
  };

  const resolutions = [
    { value: "1280:720", label: "1280:720" },
    { value: "720:1280", label: "720:1280" },
    { value: "1104:832", label: "1104:832" },
    { value: "832:1104", label: "832:1104" },
    { value: "960:960", label: "960:960" },
    { value: "1584:672", label: "1584:672" }
  ];

  const videoLengthOptions = [
    { value: "5", label: t('promptMenu.options.fiveSeconds') },
    { value: "10", label: t('promptMenu.options.tenSeconds') }
  ];

  const isGenerateDisabled = isLoading || !prompt.trim() || !selectedImage;

  return (
    <div className="space-y-6">
      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t('promptMenu.runwayGen4Turbo.prompt')}
          <Tooltip 
            content={tooltips.prompt}
            isOpen={activeTooltip === "prompt"}
            onToggle={() => handleTooltipToggle("prompt")}
          />
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('promptMenu.runwayGen4Turbo.promptPlaceholder')}
          rows={4}
          maxLength={1000}
          disabled={isLoading}
          className="resize-none focus-visible:ring-offset-2"
        />
        <div className="text-sm text-muted-foreground mt-2 flex justify-end">
          <span className={cn(prompt.length > 900 ? "text-amber-500" : "", prompt.length > 950 ? "text-red-500" : "")}>
            {prompt.length}/1000 {t('promptMenu.runwayGen4Turbo.characters')}
          </span>
        </div>
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t('promptMenu.runwayGen4Turbo.image')}
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
          {t('promptMenu.runwayGen4Turbo.seed')}
          <Tooltip 
            content={tooltips.seed}
            isOpen={activeTooltip === "seed"}
            onToggle={() => handleTooltipToggle("seed")}
          />
        </label>
        <input
          type="number"
          min={0}
          max={4294967295}
          value={seed}
          onChange={(e) => setSeed(Number(e.target.value))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus-visible:ring-offset-2 focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
          placeholder={t('promptMenu.runwayGen4Turbo.seedPlaceholder')}
          disabled={isLoading}
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t('promptMenu.runwayGen4Turbo.videoLength')}
          <Tooltip 
            content={tooltips.videoLength}
            isOpen={activeTooltip === "videoLength"}
            onToggle={() => handleTooltipToggle("videoLength")}
          />
        </label>
        <RadioGroup
          options={videoLengthOptions}
          value={videoLength.toString()}
          onChange={(value) => setVideoLength(Number(value) as 5 | 10)}
          disabled={isLoading}
        />
      </div>

      <div className="relative group" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center text-sm font-medium text-foreground mb-2">
          {t('promptMenu.runwayGen4Turbo.resolution')}
          <Tooltip 
            content={tooltips.aspectRatio}
            isOpen={activeTooltip === "aspectRatio"}
            onToggle={() => handleTooltipToggle("aspectRatio")}
          />
        </label>
        <Select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as RunwayGen4TurboAspectRatio)}
          options={resolutions}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={() => void handleGenerateVideo()}
        disabled={isGenerateDisabled}
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
