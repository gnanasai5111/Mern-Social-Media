import { toast } from "react-toastify";
export const showToast = (message, mode, type) => {
  toast[type](message, {
    position: "top-center",
    autoClose: 500,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: mode,
  });
};
