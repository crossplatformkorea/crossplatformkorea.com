import { t } from "../../../lib/i18n";

// Define the service status type directly matching the Convex schema
type ServiceStatusType = "preparing" | "online" | "underConstruction";

export interface ServicePreparingProps {
  status: ServiceStatusType;
}

export default function ServicePreparing({ status }: ServicePreparingProps) {
  // Determine which status strings to use based on the provided status
  const getStatusTitle = () => {
    switch (status) {
      case "preparing":
        return t("serviceStatus.preparing.title");
      case "underConstruction":
        return t("serviceStatus.underConstruction.title");
      default:
        return "";
    }
  };

  const getDefaultMessage = () => {
    switch (status) {
      case "preparing":
        return t("serviceStatus.preparing.message");
      case "underConstruction":
        return t("serviceStatus.underConstruction.message");
      default:
        return "";
    }
  };

  // If status is online, don't show anything
  if (status === "online") {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-16 px-4">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-16 h-16 opacity-5 pointer-events-none hidden md:block">
        <div className="w-full h-full border-2 border-primary/40 rounded-sm transform rotate-12">
          <div className="w-full h-1/4 border-b border-primary/40 flex items-center">
            <div className="w-1/2 h-full border-r border-primary/40"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 w-20 h-20 opacity-5 pointer-events-none hidden md:block">
        <div className="w-full h-full rounded-full border-2 border-primary/40 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border border-primary/40 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-primary/40"></div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
            <path d="M15 9l-6 6" />
            <path d="M9 9l6 6" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-4">{getStatusTitle()}</h2>

        <p className="text-muted-foreground mb-6">{getDefaultMessage()}</p>
      </div>
    </div>
  );
}
