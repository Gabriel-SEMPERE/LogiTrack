import { getShipments } from './api/shipmentsApi.js';

async function init() {
  try {
    const shipments = await getShipments();
    console.log(shipments);
  } catch (error) {
    console.error(error);
  }
}

init();
