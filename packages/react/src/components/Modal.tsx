import { useEffect, FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    /** Predefined modal sizes. Use className for custom widths. */
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
    /** Z-index for stacking modals. Higher values appear on top. */
    zIndex?: number;
    /** Whether this is the topmost modal. Only topmost modal's backdrop is clickable. */
    isTopmost?: boolean;
    /** Whether to add default padding and scroll wrapper. Default true. Set false for custom layouts (e.g. fixed header/footer). */
    padded?: boolean;
    /** Whether to allow content to overflow the modal (e.g. for dropdowns). Default false. */
    overflowVisible?: boolean;
}

const Modal: FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className = "",
    closeOnEscape = true,
    closeOnBackdrop = true,
    size = "2xl",
    zIndex = 100,
    isTopmost = true,
    padded = true,
    overflowVisible = false,
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            // Only handle Escape if this is the topmost modal
            if (e.key === "Escape" && closeOnEscape && isTopmost) {
                e.stopPropagation();
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc, true); // Use capture phase
        }

        return () => {
            document.removeEventListener("keydown", handleEsc, true);
        };
    }, [isOpen, onClose, closeOnEscape, isTopmost]);

    if (!isOpen) return null;

    // Size mapping for modal widths
    const sizeClasses = {
        sm: "max-w-sm", // 384px
        md: "max-w-md", // 448px
        lg: "max-w-lg", // 512px
        xl: "max-w-xl", // 576px
        "2xl": "max-w-2xl", // 672px
        "3xl": "max-w-3xl", // 768px
        "4xl": "max-w-4xl", // 896px
        full: "max-w-full", // 100%
    };

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center p-6 bg-background-modal backdrop-blur-[5px] transition-opacity"
            style={{ zIndex }}
        >
            {/* Backdrop click handler - only active for topmost modal */}
            <div
                className="absolute inset-0"
                onClick={isTopmost && closeOnBackdrop ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative bg-white rounded-2xl shadow-xl transform transition-all w-full max-h-[90vh] flex flex-col",
                    overflowVisible ? "overflow-visible" : "overflow-hidden",
                    sizeClasses[size],
                    className,
                )}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {padded ? (
                    <div className={cn(
                        "flex-1 p-8 min-h-0 custom-scrollbar",
                        overflowVisible ? "overflow-visible" : "overflow-y-auto"
                    )}>
                        {children}
                    </div>
                ) : (
                    <div className={cn(
                        "flex-1 flex flex-col min-h-0",
                        overflowVisible ? "overflow-visible" : ""
                    )}>{children}</div>
                )}
            </div>
        </div>,
        document.body,
    );
};

export const ModalHeader: FC<{ children: ReactNode; className?: string }> = ({
    children,
    className,
}) => <div className={cn("  shrink-0", className)}>{children}</div>;

export const ModalContent: FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={cn(" mt-4 flex flex-col gap-4", className)} {...props}>{children}</div>
);

export const ModalFooter: FC<{ children: ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <div className={cn(" flex mt-4 justify-end gap-4 shrink-0  pb-6", className)}>
        <div className=" w-full bg-background-db p-4 flex flex-col sm:flex-row sm:justify-end gap-4 rounded-lg">
            {children}
        </div>
    </div>
);

export default Modal;
