import { STATUS_LABELS } from './format.js';

export function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

export function createStatusBadge(status) {
  const badge = createElement('span', 'badge', STATUS_LABELS[status]);
  badge.dataset.status = status;
  return badge;
}
