import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Consistent dark-themed form field to eliminate repeated input styling */
export function FormField({ label, children, className = "" }: {
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs sm:text-sm text-zinc-400">{label}</Label>
      {children}
    </div>
  );
}

/** Pre-styled dark-themed input */
export function DarkInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={`bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 text-sm ${props.className || ""}`}
    />
  );
}
