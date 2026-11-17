import { getShipments } from './api/shipmentsApi.js';
import { createShipmentCard } from './components/shipmentCard.js';
import { debounce } from './utils/debounce.js';

const list = document.querySelector('#shipment-list');
const count = document.querySelector('#shipment-count');
const search = document.querySelector('#search');
const statusFilter = document.querySelector('#status-filter');
const carrierFilter = document.querySelector('#carrier-filter');
const sort = document.querySelector('#sort');

let shipments = [];

function renderShipments(items) {
  count.textContent = items.length;

  if (items.length === 0) {
    const message = document.createElement('p');
    message.className = 'state';
    message.textContent = 'No shipments match your filters.';
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

function matchesFilters(shipment) {
  const query = search.value.trim().toLowerCase();
  const matchesQuery =
    shipment.trackingNumber.toLowerCase().includes(query) ||
    shipment.recipient.toLowerCase().includes(query);
  const matchesStatus = !statusFilter.value || shipment.status === statusFilter.value;
  const matchesCarrier = !carrierFilter.value || shipment.carrier === carrierFilter.value;

  return matchesQuery && matchesStatus && matchesCarrier;
}

function compareShipments(a, b) {
  const byDate = new Date(a.estimatedDelivery) - new Date(b.estimatedDelivery);

  if (sort.value === 'date-desc') return -byDate;
  if (sort.value === 'priority') return b.isPriority - a.isPriority || byDate;
  return byDate;
}

function updateList() {
  renderShipments(shipments.filter(matchesFilters).sort(compareShipments));
}

function selectCard(card) {
  list.querySelector('.card--selected')?.classList.remove('card--selected');
  card.classList.add('card--selected');
}

async function loadShipments() {
  renderLoading();
  try {
    shipments = await getShipments();
    updateList();
  } catch (error) {
    console.error(error);
    renderError();
  }
}

search.addEventListener('input', debounce(updateList, 300));
statusFilter.addEventListener('change', updateList);
carrierFilter.addEventListener('change', updateList);
sort.addEventListener('change', updateList);

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="details"]');
  if (!button) return;

  selectCard(button.closest('.card'));
});

loadShipments();
