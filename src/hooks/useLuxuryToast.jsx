import { toast } from "sonner";
import useSound from "use-sound";
import ToastIcon from "../components/ui/ToastIcon";

// Sound Assets (using remote URLs for immediate demo purposes)
// In production, download these and place them in /public/sounds/
const SOUNDS = {
  success: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Crisp pop/ding
  error: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Subtle thud/warning
  warning: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Reusing error for now
  info: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Reusing success for now
};

export const useLuxuryToast = () => {
  const [playSuccess] = useSound(SOUNDS.success, { volume: 0.25 });
  const [playError] = useSound(SOUNDS.error, { volume: 0.25 });
  const [playWarning] = useSound(SOUNDS.warning, { volume: 0.25 });
  const [playInfo] = useSound(SOUNDS.info, { volume: 0.25 });

  const notify = {
    success: (message) => {
      playSuccess();
      toast.success(message, {
        icon: <ToastIcon type="success" />,
      });
    },
    error: (message) => {
      playError();
      toast.error(message, {
        icon: <ToastIcon type="error" />,
      });
    },
    warning: (message) => {
      playWarning();
      toast.warning(message, {
        icon: <ToastIcon type="warning" />,
      });
    },
    info: (message) => {
      playInfo();
      toast.info(message, {
        icon: <ToastIcon type="info" />,
      });
    },
  };

  return notify;
};
