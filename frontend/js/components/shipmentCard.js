import { STATUS_LABELS, formatDate } from '../utils/format.js';

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function createShipmentCard(shipment) {
  const card = createElement('article', 'card');
  card.dataset.id = shipment.id;

  const header = createElement('div', 'card__row');
  const badge = createElement('span', 'badge', STATUS_LABELS[shipment.status]);
  badge.dataset.status = shipment.status;
  header.append(createElement('span', 'card__tracking', shipment.trackingNumber), badge);

  const recipient = createElement('p', 'card__recipient', shipment.recipient);
  if (shipment.isPriority) {
    recipient.append(createElement('span', 'tag', 'Priority'));
  }

  const meta = createElement('p', 'card__meta', `${shipment.destinationCity} · ${shipment.carrier}`);

  const footer = createElement('div', 'card__row');
  const details = createElement('button', 'btn', 'Details');
  details.type = 'button';
  details.dataset.action = 'details';
  footer.append(createElement('p', 'card__meta', `ETA ${formatDate(shipment.estimatedDelivery)}`), details);

  card.append(header, recipient, meta, footer);
  return card;
}
