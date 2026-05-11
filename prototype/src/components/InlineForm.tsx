import { useState } from 'react';
import type { FormField, Pattern } from '../lib/types';
import { patternMeta, proposingCaption } from '../lib/patterns';
import { PatternBadge } from './PatternBadge';

type Props = {
  pattern: Pattern;
  title: string;
  intro?: string;
  fields: FormField[];
  submitLabel: string;
  explainMode: boolean;
  onSubmit: (summary: string) => void;
};

type Values = Record<string, string | boolean>;

const initialValues = (fields: FormField[]): Values => {
  const v: Values = {};
  fields.forEach((f) => {
    if (f.kind === 'checkbox') v[f.name] = f.defaultValue ?? false;
    else if (f.kind === 'select')
      v[f.name] = f.defaultValue ?? f.options[0]?.value ?? '';
    else v[f.name] = f.defaultValue ?? '';
  });
  return v;
};

export function InlineForm({
  pattern,
  title,
  intro,
  fields,
  submitLabel,
  explainMode,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Values>(() => initialValues(fields));
  const meta = patternMeta[pattern];

  const allRequiredMet = fields.every((f) => {
    if (f.kind === 'checkbox') return values[f.name] === true;
    return values[f.name] !== '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequiredMet) return;
    onSubmit(`Submitted: ${title}`);
  };

  return (
    <div className="flex items-start gap-2">
      <div
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-[11px] font-bold tracking-wider text-ltu-red"
      >
        LT
      </div>
      <form
        onSubmit={handleSubmit}
        className={[
          'flex w-full max-w-[78%] flex-col gap-3 rounded-2xl rounded-bl-md border border-border bg-white p-4 shadow-soft',
          explainMode && `border-l-[3px] ${meta.borderAccentClass}`,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {explainMode && (
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${meta.captionTextClass}`}
            >
              {proposingCaption(pattern)}
            </span>
            <PatternBadge pattern={pattern} />
          </div>
        )}
        <h3 className="text-[15px] font-semibold text-ltu-navy">{title}</h3>
        {intro && <p className="text-sm text-muted">{intro}</p>}

        <div className="flex flex-col gap-3">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              {f.kind === 'select' && (
                <>
                  <label
                    htmlFor={`fld-${f.name}`}
                    className="text-sm font-medium text-ltu-navy"
                  >
                    {f.label}
                  </label>
                  <select
                    id={`fld-${f.name}`}
                    className="focus-ring rounded-lg border border-border bg-white px-3 py-2 text-sm text-ltu-navy"
                    value={String(values[f.name] ?? '')}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.name]: e.target.value }))
                    }
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {f.kind === 'text' && (
                <>
                  <label
                    htmlFor={`fld-${f.name}`}
                    className="text-sm font-medium text-ltu-navy"
                  >
                    {f.label}
                  </label>
                  <input
                    id={`fld-${f.name}`}
                    type="text"
                    placeholder={f.placeholder}
                    className="focus-ring rounded-lg border border-border bg-white px-3 py-2 text-sm text-ltu-navy"
                    value={String(values[f.name] ?? '')}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.name]: e.target.value }))
                    }
                  />
                </>
              )}
              {f.kind === 'checkbox' && (
                <label
                  htmlFor={`fld-${f.name}`}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-sm text-ltu-navy hover:bg-surface-soft"
                >
                  <input
                    id={`fld-${f.name}`}
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-ltu-red"
                    checked={values[f.name] === true}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.name]: e.target.checked }))
                    }
                  />
                  <span>{f.label}</span>
                </label>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!allRequiredMet}
          className="focus-ring inline-flex items-center justify-center rounded-full bg-ltu-red px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
