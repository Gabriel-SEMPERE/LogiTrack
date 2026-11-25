import { getShipments } from './api/shipmentsApi.js';
import { createShipmentCard } from './components/shipmentCard.js';
import { openShipmentModal } from './components/shipmentModal.js';
import { setShipments, findShipment, replaceShipment, getVisibleShipments } from './state/store.js';
import { debounce } from './utils/debounce.js';
import { createElement } from './utils/dom.js';
import { saveItem, loadItem } from './utils/storage.js';

const PREFERENCES_KEY = 'logitrack-preferences';

const list = document.querySelector('#shipment-list');
const count = document.querySelector('#shipment-count');
const searchInput = document.querySelector('#search');
const statusSelect = document.querySelector('#status-filter');
const carrierSelect = document.querySelector('#carrier-filter');
const sortSelect = document.querySelector('#sort');

function getFilters() {
  return {
    search: searchInput.value.trim(),
    status: statusSelect.value,
    carrier: carrierSelect.value,
    sort: sortSelect.value,
  };
}

function savePreferences() {
  saveItem(PREFERENCES_KEY, {
    status: statusSelect.value,
    carrier: carrierSelect.value,
    sort: sortSelect.value,
  });
}

function restorePreferences() {
  const preferences = loadItem(PREFERENCES_KEY);

  if (!preferences) {
    return;
  }

  statusSelect.value = preferences.status;
  carrierSelect.value = preferences.carrier;
  sortSelect.value = preferences.sort;
}

function handleFilterChange() {
  savePreferences();
  renderList();
}

function showMessage(text) {
  list.replaceChildren(createElement('p', 'state', text));
}

function showError() {
  const box = createElement('div', 'state error');
  box.setAttribute('role', 'alert');

  const retryButton = createElement('button', 'btn', 'Retry');
  retryButton.type = 'button';
  retryButton.addEventListener('click', loadShipments);

  box.append(createElement('p', '', "Couldn't load shipments."), retryButton);
  list.replaceChildren(box);
}

function renderList() {
  const shipments = getVisibleShipments(getFilters());
  count.textContent = shipments.length;

  if (shipments.length === 0) {
    showMessage('No shipments match your filters.');
    return;
  }

  const cards = shipments.map((shipment) => createShipmentCard(shipment));
  list.replaceChildren(...cards);
}

function handleShipmentSaved(updatedShipment) {
  replaceShipment(updatedShipment);
  renderList();
}

function handleListClick(event) {
  const detailsButton = event.target.closest('[data-action="details"]');

  if (!detailsButton) {
    return;
  }

  const card = detailsButton.closest('.card');
  const shipment = findShipment(card.dataset.id);
  openShipmentModal(shipment, handleShipmentSaved);
}

async function loadShipments() {
  count.textContent = '';
  showMessage('Loading shipments…');

  try {
    const shipments = await getShipments();
    setShipments(shipments);
    renderList();
  } catch (error) {
    console.error(error);
    showError();
  }
}

searchInput.addEventListener('input', debounce(renderList, 300));
statusSelect.addEventListener('change', handleFilterChange);
carrierSelect.addEventListener('change', handleFilterChange);
sortSelect.addEventListener('change', handleFilterChange);
list.addEventListener('click', handleListClick);

restorePreferences();
loadShipments();
