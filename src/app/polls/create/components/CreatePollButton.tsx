import { Button } from '@/components/primitives/button';
import { cn } from '@/utils/styles';

export function CreatePollButton({
  loading,
  disabled,
  onClick,
}: {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      size="lg"
      className={cn(
        'relative h-[56px] w-full rounded-[2px] font-semibold text-base',
        disabled
          ? 'bg-[#ddd] text-[#9e9e9e] shadow-none hover:bg-[#ddd]'
          : 'bg-[#1976d2] text-white hover:bg-[#1565c0]'
      )}
    >
      <span className={cn(loading && 'invisible opacity-0')}>
        {loading ? '作成中...' : 'ページを作成'}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="h-5 w-5 animate-spin text-current" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </Button>
  );
}
