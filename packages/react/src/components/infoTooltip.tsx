import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "../utils/cn";

interface InfoTooltipProps {
    /** Content to show when the info icon is clicked. */
    content: ReactNode;
    /** Optional additional classes for the wrapper. */
    className?: string;
}

const InfoTooltip: FC<InfoTooltipProps> = ({ content, className }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div
            ref={wrapperRef}
            className={cn("inline-flex items-center relative cursor-pointer", className)}
        >
            <button
                type="button"
                aria-label="More information"
                onClick={() => setOpen((prev) => !prev)}
                className="ml-1 inline-flex items-center justify-center rounded-full border-none border-border-light w-4 h-4 text-[10px] text-foreground bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer"
            >
                <Info className="w-4 h-4 cursor-pointer text-gray-600" />
            </button>
            {open && (
                <div
                    className={cn(
                        "absolute z-110 left-0 top-full mt-1.5 w-72 max-w-[min(18rem,calc(100vw-2rem))] rounded-md bg-white shadow-lg border border-gray-200 p-3 text-xs text-gray-600 font-medium text-left wrap-break-word",
                    )}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;

