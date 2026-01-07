import { toast } from "sonner";
import ToastIcon from "../components/ui/ToastIcon";
import {
  playSuccessSound,
  playErrorSound,
  playWarningSound,
  playInfoSound,
} from "../utils/soundUtils";

export const useLuxuryToast = () => {
  const notify = {
    success: (message) => {
      playSuccessSound();
      toast.success(message, {
        icon: <ToastIcon type="success" />,
      });
    },
    error: (message) => {
      playErrorSound();
      toast.error(message, {
        icon: <ToastIcon type="error" />,
      });
    },
    warning: (message) => {
      playWarningSound();
      toast.warning(message, {
        icon: <ToastIcon type="warning" />,
      });
    },
    info: (message) => {
      playInfoSound();
      toast.info(message, {
        icon: <ToastIcon type="info" />,
      });
    },
  };

  return notify;
};
