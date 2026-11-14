type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <p
      className="text-sm font-medium text-gf-text sm:text-right"
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      Step {currentStep} of {totalSteps}
    </p>
  );
}
