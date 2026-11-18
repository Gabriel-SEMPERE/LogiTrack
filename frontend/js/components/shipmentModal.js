import { updateShipment } from '../api/shipmentsApi.js';
import { STATUS_LABELS, formatDate } from '../utils/format.js';

const modal = document.querySelector('#shipment-modal');
const title = modal.querySelector('#modal-title');
const details = modal.querySelector('#modal-details');
const form = modal.querySelector('#modal-form');
const error = form.querySelector('.modal__error');
const saveButton = form.querySelector('[type="submit"]');

let currentShipment;
let onSaved;

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

export function openShipmentModal(shipment, handleSaved) {
  currentShipment = shipment;
  onSaved = handleSaved;
  error.hidden = true;
  title.textContent = shipment.trackingNumber;

  details.replaceChildren(
    ...createDetail('Status', createBadge(shipment.status)),
    ...createDetail('Recipient', shipment.recipient),
    ...createDetail('City', shipment.destinationCity),
    ...createDetail('Carrier', shipment.carrier),
    ...createDetail('Departure', formatDate(shipment.departureDate)),
    ...createDetail('Estimated delivery', formatDate(shipment.estimatedDelivery)),
  );

  form.elements.status.value = shipment.status;
  form.elements.isPriority.checked = shipment.isPriority;
  form.elements.internalNotes.value = shipment.internalNotes;

  modal.showModal();
}

modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target.closest('[data-action="close"]')) {
    modal.close();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.hidden = true;
  saveButton.disabled = true;
  saveButton.textContent = 'Saving…';

  try {
    const updated = await updateShipment(currentShipment.id, {
      status: form.elements.status.value,
      isPriority: form.elements.isPriority.checked,
      internalNotes: form.elements.internalNotes.value,
    });
    onSaved(updated);
    modal.close();
  } catch (saveError) {
    console.error(saveError);
    error.hidden = false;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Save';
  }
});
