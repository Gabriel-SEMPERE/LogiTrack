import { STATUS_LABELS, formatDate } from '../utils/format.js';

const modal = document.querySelector('#shipment-modal');
const title = modal.querySelector('#modal-title');
const details = modal.querySelector('#modal-details');

function createDetail(label, value) {
  const term = document.createElement('dt');
  term.textContent = label;
  const description = document.createElement('dd');
  description.append(value);
  return [term, description];
}

function createBadge(status) {
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.dataset.status = status;
  badge.textContent = STATUS_LABELS[status];
  return badge;
}

export function openShipmentModal(shipment) {
  title.textContent = shipment.trackingNumber;

  details.replaceChildren(
    ...createDetail('Status', createBadge(shipment.status)),
    ...createDetail('Recipient', shipment.recipient),
    ...createDetail('City', shipment.destinationCity),
    ...createDetail('Carrier', shipment.carrier),
    ...createDetail('Departure', formatDate(shipment.departureDate)),
    ...createDetail('Estimated delivery', formatDate(shipment.estimatedDelivery)),
    ...createDetail('Priority', shipment.isPriority ? 'Yes' : 'No'),
    ...createDetail('Internal notes', shipment.internalNotes || '—'),
  );

  modal.showModal();
}

modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target.closest('[data-action="close"]')) {
    modal.close();
  }
});
