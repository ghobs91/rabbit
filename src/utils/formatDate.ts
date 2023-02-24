type ParsedDate =
  | { kind: 'abs'; value: Date }
  | { kind: 'days'; value: number }
  | { kind: 'hours'; value: number }
  | { kind: 'minutes'; value: number }
  | { kind: 'seconds'; value: number }
  | { kind: 'now' };

export type DateFormatter = (parsedDate: ParsedDate) => string;

const defaultDateFormatter = (parsedDate: ParsedDate): string => {
  switch (parsedDate.kind) {
    case 'abs':
      return parsedDate.value.toLocaleDateString();
    case 'days':
      return `${parsedDate.value}d`;
    case 'hours':
      return `${parsedDate.value}h`;
    case 'minutes':
      return `${parsedDate.value}m`;
    case 'seconds':
      return `${parsedDate.value}s`;
    case 'now':
      return 'now';
    default:
      return '';
  }
};

const calcDiffSec = (date: Date, currentDate: Date): number =>
  (Number(currentDate) - Number(date)) / 1000;

const parseDateDiff = (date: Date, currentDate: Date): ParsedDate => {
  const diffSec = calcDiffSec(date, currentDate);

  if (diffSec < 10) {
    return { kind: 'now' };
  }
  if (diffSec < 60) {
    return { kind: 'seconds', value: Math.round(diffSec) };
  }
  if (diffSec < 3600) {
    return { kind: 'minutes', value: Math.round(diffSec / 60) };
  }
  if (diffSec < 86400) {
    // 1 days
    return { kind: 'hours', value: Math.round(diffSec / 3600) };
  }
  if (diffSec < 604800) {
    // 1 week
    return { kind: 'days', value: Math.round(diffSec / 86400) };
  }
  return { kind: 'abs', value: date };
};

export const formatAbsolute = (date: Date, currentDate: Date = new Date()): string => {
  if (date.getDate() === currentDate.getDate()) {
    return date.toLocaleTimeString();
  }
  return date.toLocaleString();
};

export const formatRelative = (
  date: Date,
  currentDate: Date = new Date(),
  formatter: DateFormatter = defaultDateFormatter,
): string => formatter(parseDateDiff(date, currentDate));
