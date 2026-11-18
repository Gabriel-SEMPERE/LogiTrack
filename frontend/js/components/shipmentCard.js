import { createElement, createStatusBadge } from '../utils/dom.js';
import { formatDate } from '../utils/format.js';

export function createShipmentCard(shipment) {
  const card = createElement('article', 'card');
  card.dataset.id = shipment.id;

  const topRow = createElement('div', 'row');
  const trackingNumber = createElement('span', 'card__tracking', shipment.trackingNumber);
  topRow.append(trackingNumber, createStatusBadge(shipment.status));

  const recipient = createElement('p', 'card__recipient', shipment.recipient);
  if (shipment.isPriority) {
    recipient.append(createElement('span', 'badge', 'Priority'));
  }

  const destination = createElement('p', 'card__meta', `${shipment.destinationCity} · ${shipment.carrier}`);

  const bottomRow = createElement('div', 'row');
  const eta = createElement('p', 'card__meta', `ETA ${formatDate(shipment.estimatedDelivery)}`);
  const detailsButton = createElement('button', 'btn', 'Details');
  detailsButton.type = 'button';
  detailsButton.dataset.action = 'details';
  bottomRow.append(eta, detailsButton);

  card.append(topRow, recipient, destination, bottomRow);
*
    return card;
}
