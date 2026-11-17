export const STATUS_LABELS = {
  IN_TRANSIT: 'In transit',
  DELIVERED: 'Delivered',
  DELAYED: 'Delayed',
  PENDING: 'Pending',
};

export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
