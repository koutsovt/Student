import { ShieldCheck } from 'lucide-react';

type Props = {
  statusText: string;
};

export function HandoffState({ statusText }: Props) {
  return (
    <div className="border-l-4 border-success bg-success/5 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <ShieldCheck className="h-4 w-4" aria-hidden />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-success">
            {statusText}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
            <span className="text-xs text-muted">Held — wellbeing team paged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
