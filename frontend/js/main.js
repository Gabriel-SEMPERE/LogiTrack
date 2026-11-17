import { getShipments } from './api/shipmentsApi.js';
import { createShipmentCard } from './components/shipmentCard.js';
import { debounce } from './utils/debounce.js';

const list = document.querySelector('#shipment-list');
const count = document.querySelector('#shipment-count');
const search = document.querySelector('#search');

let shipments = [];

function renderShipments(items) {
  count.textContent = items.length;

  if (items.length === 0) {
    const message = document.createElement('p');
    message.className = 'state';
    message.textContent = 'No shipments match your search.';
    list.replaceChildren(message);
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((shipment) => fragment.append(createShipmentCard(shipment)));
  list.replaceChildren(fragment);
}

function renderLoading() {
  const message = document.createElement('p');
  message.className = 'state';
  message.textContent = 'Loading shipments…';
  list.replaceChildren(message);
  count.textContent = '';
}

function renderError() {
  const box = document.createElement('div');
  box.className = 'state state--error';
  box.setAttribute('role', 'alert');

  const message = document.createElement('p');
  message.textContent = 'Couldn’t load shipments.';

  const retry = document.createElement('button');
  retry.className = 'btn';
  retry.type = 'button';
  retry.textContent = 'Retry';
  retry.addEventListener('click', loadShipments);

  box.append(message, retry);
  list.replaceChildren(box);
}

function applySearch() {
  const query = search.value.trim().toLowerCase();

  const results = shipments.filter((shipment) =>
    shipment.trackingNumber.toLowerCase().includes(query) ||
    shipment.recipient.toLowerCase().includes(query)
  );

  renderShipments(results);
}

async function loadShipments() {
  renderLoading();
  try {
    shipments = await getShipments();
    applySearch();
  } catch (error) {
    console.error(error);
    renderError();
  }
}

search.addEventListener('input', debounce(applySearch, 300));

loadShipments();
