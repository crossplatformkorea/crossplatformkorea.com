import { Select } from "./ui/select";

export type ModelType = "veo2" | "runway-gen4-turbo";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const modelOptions = [
    { value: "veo2", label: "Veo 2" },
    { value: "runway-gen4-turbo", label: "Runway Gen4 Turbo" }
  ];

  return (
    <div className="p-4 border-b border-border mb-2">
      <label className="block text-sm font-medium text-foreground mb-2">Model</label>
      <Select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as ModelType)}
        options={modelOptions}
      />
    </div>
  );
}
