import { useState, useEffect, useRef, FC, ReactNode } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./Button";
import { AlertText } from "./AlertText";
import { cn } from "../utils/cn";

/**
 * Generates the SVG path for a step based on dimensions and position.
 */
const getStepPath = (
  width: number,
  height: number,
  position: "first" | "middle" | "last",
  radius = 4,
  arrowDepth = 14
) => {
  if (!width || !height) return "";

  const w = width;
  const h = height;
  const r = radius;
  const a = arrowDepth;

  // Rounding factors for the "V" shapes
  // Slope approx 24/14 ~= 1.7
  // We back off by dx=2, dy~3.5
  const dx = 2;
  const dy = 3.5;

  let d = "";

  // 1. START at Top Left
  if (position === "first") {
    // Round Top-Left Corner
    d += `M 0 ${r} A ${r} ${r} 0 0 1 ${r} 0`;
  } else {
    // Middle/Last: Sharp Top-Left Horn at (0,0)
    d += `M 0 0`;
  }

  // 2. TOP EDGE to Top Right
  if (position === "last") {
    // To Top-Right (rounded)
    d += ` L ${w - r} 0 A ${r} ${r} 0 0 1 ${w} ${r}`;
  } else {
    // To Arrow Start Shoulder
    // This was the missing line causing the "wedge" look
    d += ` L ${w - a} 0`;

    // Arrow Tip Rounding
    // Line to start of round
    d += ` L ${w - dx} ${h / 2 - dy}`;
    // Curve the tip
    d += ` Q ${w} ${h / 2} ${w - dx} ${h / 2 + dy}`;
  }

  // 3. RIGHT SIDE (Tip or Flat)
  if (position === "last") {
    // Flat Right Side to Bottom-Right (rounded)
    d += ` L ${w} ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h}`;
  } else {
    // Continue from tip curve to Bottom Right Shoulder
    d += ` L ${w - a} ${h}`;
  }

  // 4. BOTTOM EDGE to Bottom Left
  if (position === "first") {
    // To Bottom-Left (rounded)
    d += ` L ${r} ${h} A ${r} ${r} 0 0 1 0 ${h - r}`;
    // Close to start (Top Left)
    d += ` L 0 ${r}`;
  } else {
    // Middle/Last: To Bottom-Left Horn at (0,h)
    d += ` L 0 ${h}`;

    // 5. INDENT (The "Innie")
    // Indent Tip is at (a, h/2)
    // Rounding the valley:
    // Line to before valley
    d += ` L ${a - dx} ${h / 2 + dy}`;
    // Curve the valley
    d += ` Q ${a} ${h / 2} ${a - dx} ${h / 2 - dy}`;
    // Line to top
    d += ` L 0 0`;
  }

  // Close Path
  d += " Z";

  return d;
};

export interface Step {
  id?: number;
  title: string;
  element?: ReactNode;
}

interface StepItemProps {
  step: Step;
  stepNumber: number;
  status: "active" | "completed" | "pending";
  position: "first" | "middle" | "last";
  completedColor?: string;
  onStepClick?: (stepNumber: number) => void;
}

const StepItem: FC<StepItemProps> = ({
  step,
  stepNumber,
  status,
  position,
  completedColor,
  onStepClick,
}) => {
  const isClickable = status === "completed" && Boolean(onStepClick);
  const isFuture = status === "pending";
  const containerRef = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const setContainerRef = (element: HTMLDivElement | HTMLButtonElement | null) => {
    containerRef.current = element;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (status === "active" && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [status]);

  // Colors
  let fillColor = "white";
  let strokeColor = "var(--color-gray)"; // Inactive border
  let textColor = "text-gray-400";

  if (status === "completed") {
    fillColor = completedColor || "var(--color-accent-yellow)";
    strokeColor = completedColor || "var(--color-accent-yellow)";
    textColor = "text-white";
  } else if (status === "active") {
    fillColor = "white";
    strokeColor = "var(--color-accent-yellow)";
    textColor = "text-accent-yellow";
  }

  const pathD = getStepPath(
    dimensions.width,
    dimensions.height,
    position,
    4, // Corner Radius
    14 // Arrow Depth
  );

  const handleClick = () => {
    if (isClickable) onStepClick?.(stepNumber);
  };

  const sharedClassName = cn(
    "relative flex-1 min-w-[120px] h-12 flex items-center justify-center",
    position !== "first" && "-ml-2",
    isClickable &&
      "cursor-pointer hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow focus-visible:ring-offset-1 rounded-sm",
    isFuture && "cursor-not-allowed opacity-60",
  );

  const inner = (
    <>
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <path
          d={pathD}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative z-10 font-medium text-sm flex items-center justify-center w-full px-6 pointer-events-none">
        <span className={`truncate ${textColor}`}>{step.title}</span>
      </div>
    </>
  );

  if (isClickable) {
    return (
      <button
        ref={setContainerRef}
        type="button"
        onClick={handleClick}
        className={sharedClassName}
        aria-label={`Go to step ${stepNumber}: ${step.title}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      ref={setContainerRef}
      className={sharedClassName}
      aria-current={status === "active" ? "step" : undefined}
      aria-disabled={isFuture ? true : undefined}
    >
      {inner}
    </div>
  );
};

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  completedColor?: string;
  /** When set, completed steps are clickable; future steps stay disabled. */
  goToStep?: (step: number) => void;
  goToPreviousStep?: () => void;
  goToNextStep?: () => void;
  onFinalSubmit?: () => void | Promise<void>;
  finalButtonText?: string;
  proceedButtonText?: string;
  hideProceedButton?: boolean;
  /** Error message shown just above the Next/Previous buttons. */
  error?: string;
  /** When true, disables Proceed/Submit (e.g. uploads in progress on a step). */
  proceedDisabled?: boolean;
  /** External loading state for Proceed/Submit button. */
  proceedLoading?: boolean;
}

export const Stepper: FC<StepperProps> = ({
  steps,
  currentStep,
  completedColor,
  goToStep,
  goToPreviousStep,
  goToNextStep,
  onFinalSubmit,
  finalButtonText = "Submit",
  proceedButtonText = "Proceed",
  hideProceedButton = false,
  error,
  proceedDisabled = false,
  proceedLoading = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [steps]);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  // Check if we're on the last step
  const isLastStep = currentStep === steps.length;

  // Handle proceed/submit button click
  const handleProceed = async () => {
    if (isLastStep && onFinalSubmit) {
      setIsSubmitting(true);
      try {
        await onFinalSubmit();
      } catch (error) {
        console.error("Final submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else if (goToNextStep) {
      goToNextStep();
    }
  };

  // Find the current step's element
  // Support both id-based and index-based steps for backward compatibility
  const currentStepData =
    steps.find((step) => step.id !== undefined && step.id === currentStep) ||
    steps[currentStep - 1]; // Fallback to index-based lookup (currentStep is 1-indexed)
  const currentElement = currentStepData?.element;

  // Check if any steps have elements (for backward compatibility)
  const hasAnyElements = steps.some((step) => step.element !== undefined);

  // Step Navigation Component
  const navigation = (
    <div className="relative w-full flex items-center">
      {/* Mobile Scroll Arrow Left */}
      {canScrollLeft && (
        <div className="md:hidden absolute -left-3 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 rounded-full bg-gray shadow-md flex items-center justify-center text-foreground hover:bg-gray500"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      )}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-1 w-full overflow-x-auto no-scrollbar scroll-smooth px-1 pb-1"
      >
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          const position = isFirst ? "first" : isLast ? "last" : "middle";
          const stepNumber = index + 1;

          let status: "active" | "completed" | "pending" = "pending";
          if (stepNumber < currentStep) status = "completed";
          if (stepNumber === currentStep) status = "active";

          return (
            <StepItem
              key={index}
              step={step}
              stepNumber={stepNumber}
              status={status}
              position={position}
              completedColor={completedColor}
              onStepClick={goToStep}
            />
          );
        })}
      </div>

      {/* Mobile Scroll Arrow Right */}
      {canScrollRight && (
        <div className="md:hidden absolute -right-3 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={scrollRight}
            className="w-8 h-8 rounded-full bg-gray shadow-md flex items-center justify-center text-foreground hover:bg-gray500"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  // If no elements are provided, return the same structure as before (backward compatible)
  if (!hasAnyElements) {
    return navigation;
  }

  // If elements are provided, wrap in container and show current step's element
  return (
    <div className="w-full">
      <div className="">
        {navigation}
      </div>

      {/* Current Step Content */}
      {currentElement && (
        <div className="mt-6 w-full">
          <div className=" xl:w-[90%]">
            {currentElement}
          </div>

          {error && (
            <AlertText variant="error" className="my-6">
              {error}
            </AlertText>
          )}

          <div
            className={`py-4 md:py-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 bg-background-db px-4 ${error ? "mt-2" : "mt-4"}`}
          >
            <Button
              variant="ghost"
              className="px-8 border-foreground text-foreground text-base w-full md:w-auto"
              onClick={goToPreviousStep}
              disabled={!goToPreviousStep || isSubmitting || proceedLoading}
            >
              Previous
            </Button>

            <div className="flex gap-4 w-full md:w-auto md:justify-end">
              {!hideProceedButton ? (
                <Button
                  className="px-6 md:px-10 text-base flex-1 md:flex-none w-full md:w-auto"
                  onClick={handleProceed}
                  disabled={isSubmitting || proceedLoading || proceedDisabled}
                  loading={isSubmitting || proceedLoading}
                >
                  {isLastStep ? finalButtonText : proceedButtonText}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Stepper;
