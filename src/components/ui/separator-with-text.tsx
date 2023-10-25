import { cn } from "@/lib/utils";

type SeparatorWithTextProps = {
  text: string;
} & React.HTMLAttributes<HTMLDivElement>;

const SeparatorWithText = ({
  text,
  className,
  ...rest
}: SeparatorWithTextProps) => {
  return (
    <div className={cn("relative w-full", className)} {...rest}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center">
        <span
          className={cn(
            "pointer-events-none cursor-default select-none px-2 text-sm text-neutral-300 bg-neutral-50",
          )}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default SeparatorWithText;
