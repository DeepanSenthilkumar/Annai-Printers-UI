import { toast } from "react-toastify";

const showToast = (
  type: "success" | "error" | "warning",
  message: string,
  title?: string
) => {
  toast.dismiss();

  toast[type](
    <div>
      {title && <div className="font-semibold">{title}</div>}
      <div className="text-sm">{message}</div>
    </div>
  );
};

export const toaster = {
  success: (message: string, title?: string) =>
    showToast("success", message, title),

  error: (message: string, title?: string) =>
    showToast("error", message, title),

  warning: (message: string, title?: string) =>
    showToast("warning", message, title),
};