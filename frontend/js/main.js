import { getShipments } from './api/shipmentsApi.js';
import { createShipmentCard } from './components/shipmentCard.js';

const list = document.querySelector('#shipment-list');
const count = document.querySelector('#shipment-count');

function renderShipments(shipments) {
  const fragment = document.createDocumentFragment();
  shipments.forEach((shipment) => fragment.append(createShipmentCard(shipment)));
  list.replaceChildren(fragment);
  count.textContent = shipments.length;
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

async function loadShipments() {
  renderLoading();
  try {
    const shipments = await getShipments();
    renderShipments(shipments);
  } catch (error) {
    console.error(error);
    renderError();
  }
}

loadShipments();
