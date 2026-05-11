import { useState } from 'react';
import { Send } from 'lucide-react';

type Props = {
  disabled?: boolean;
  placeholder: string;
  onSend: (text: string) => void;
};

export function ChatComposer({ disabled = false, placeholder, onSend }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  return (
    <form
      className="flex items-center gap-2 border-t border-border bg-white p-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <input
        id="chat-input"
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="focus-ring flex-1 rounded-full border border-border bg-surface-soft px-4 py-3 text-[16px] text-ltu-navy placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface-soft disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ltu-red text-white shadow-soft transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
