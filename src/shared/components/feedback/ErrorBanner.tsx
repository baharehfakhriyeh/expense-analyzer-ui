import { CircleHelp, X } from "lucide-react";
export default function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="alert" role="alert">
      <CircleHelp size={17} />
      <span>{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
