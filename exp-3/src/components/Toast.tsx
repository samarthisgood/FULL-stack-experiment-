import { toast } from "sonner";

// Thin wrapper so every page uses the same feedback API.
export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message),
};

export { Toaster } from "@/components/ui/sonner";
