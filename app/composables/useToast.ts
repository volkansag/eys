export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  updateKey?: number;
  slot: number; // Fixed position slot assigned at creation
}

const MAX_TOASTS = 5;

export const useToast = () => {
  const toasts = useState<Toast[]>("toasts", () => []);

  // New toast always stacks on top of the highest existing toast
  const getNextSlot = (): number => {
    if (toasts.value.length === 0) return 0;
    const maxSlot = Math.max(...toasts.value.map((t) => t.slot));
    return maxSlot + 1;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const addToast = (toast: Omit<Toast, "id" | "slot">) => {
    // Check if toast already exists
    const existingIndex = toasts.value.findIndex(
      (t) =>
        t.message === toast.message &&
        t.type === toast.type &&
        t.title === toast.title,
    );

    if (existingIndex !== -1) {
      const existing = toasts.value[existingIndex];
      if (!existing) return;

      // Duplicate found: just reset timer, keep position
      const updatedToast: Toast = {
        ...existing,
        duration: toast.duration || 5000,
        updateKey: (existing.updateKey || 0) + 1,
        // slot stays the same - no repositioning
      };
      toasts.value.splice(existingIndex, 1, updatedToast);
      return;
    }

    const id = Math.random().toString(36).substr(2, 9);
    const slot = getNextSlot();
    const newToast: Toast = {
      id,
      duration: 5000,
      updateKey: 0,
      slot,
      ...toast,
    };

    toasts.value.push(newToast);
  };

  // Check if a toast with this message already exists
  const hasToast = (message: string, type: Toast["type"]): boolean => {
    return toasts.value.some((t) => t.message === message && t.type === type);
  };

  return {
    toasts,
    addToast,
    removeToast,
    hasToast,
  };
};
