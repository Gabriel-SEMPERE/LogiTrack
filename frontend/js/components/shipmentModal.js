import { updateShipment } from '../api/shipmentsApi.js';
import { createElement, createStatusBadge } from '../utils/dom.js';
import { formatDate } from '../utils/format.js';

const modal = document.querySelector('#shipment-modal');
const title = document.querySelector('#modal-title');
const details = document.querySelector('#modal-details');
const form = document.querySelector('#modal-form');
const errorMessage = form.querySelector('.error');
const saveButton = form.querySelector('[type="submit"]');

let openedShipment = null;
let onSaved = null;

function addDetail(label, value) {
  const description = createElement('dd');
  description.append(value);
  details.append(createElement('dt', '', label), description);
}

function fillDetails(shipment) {
  details.replaceChildren();
  addDetail('Status', createStatusBadge(shipment.status));
  addDetail('Recipient', shipment.recipient);
  addDetail('City', shipment.destinationCity);
  addDetail('Carrier', shipment.carrier);
  addDetail('Departure', formatDate(shipment.departureDate));
  addDetail('Estimated delivery', formatDate(shipment.estimatedDelivery));
}

function fillForm(shipment) {
  form.elements.status.value = shipment.status;
  form.elements.isPriority.checked = shipment.isPriority;
  form.elements.internalNotes.value = shipment.internalNotes;
}

function readForm() {
  return {
    status: form.elements.status.value,
    isPriority: form.elements.isPriority.checked,
    internalNotes: form.elements.internalNotes.value,
  };
}

function setSaving(isSaving) {
  saveButton.disabled = isSaving;
  saveButton.textContent = isSaving ? 'Saving…' : 'Save';
}

export function openShipmentModal(shipment, handleSaved) {
  openedShipment = shipment;
  onSaved = handleSaved;

  title.textContent = shipment.trackingNumber;
  fillDetails(shipment);
  fillForm(shipment);
  errorMessage.hidden = true;

  modal.showModal();
}

function handleModalClick(event) {
  const clickedBackdrop = event.target === modal;
  const clickedClose = event.target.closest('[data-action="close"]');

  if (clickedBackdrop || clickedClose) {
    modal.close();
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  errorMessage.hidden = true;
  setSaving(true);

  try {
    const updatedShipment = await updateShipment(openedShipment.id, readForm());
    onSaved(updatedShipment);
    modal.close();
  } catch (error) {
    console.error(error);
    errorMessage.hidden = false;
  }

  setSaving(false);
}

modal.addEventListener('click', handleModalClick);
form.addEventListener('submit', handleSubmit);
