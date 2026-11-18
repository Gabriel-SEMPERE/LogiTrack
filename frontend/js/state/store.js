let shipments = [];

export function setShipments(newShipments) {
  shipments = newShipments;
}

export function findShipment(id) {
  return shipments.find((shipment) => String(shipment.id) === String(id));
}

export function replaceShipment(updatedShipment) {
  const index = shipments.findIndex((shipment) => shipment.id === updatedShipment.id);
  shipments[index] = updatedShipment;
}

function matchesFilters(shipment, filters) {
  const search = filters.search.toLowerCase();
  const trackingNumber = shipment.trackingNumber.toLowerCase();
  const recipient = shipment.recipient.toLowerCase();

  if (!trackingNumber.includes(search) && !recipient.includes(search)) {
    return false;
  }

  if (filters.status && shipment.status !== filters.status) {
    return false;
  }

  if (filters.carrier && shipment.carrier !== filters.carrier) {
    return false;
  }

  return true;
}

function compareByDate(a, b) {
  return new Date(a.estimatedDelivery) - new Date(b.estimatedDelivery);
}

function compareShipments(a, b, sort) {
  if (sort === 'date-desc') {
    return compareByDate(b, a);
  }

  if (sort === 'priority' && a.isPriority !== b.isPriority) {
    return a.isPriority ? -1 : 1;
  }

  return compareByDate(a, b);
}

export function getVisibleShipments(filters) {
  const visibleShipments = shipments.filter((shipment) => matchesFilters(shipment, filters));
  return visibleShipments.sort((a, b) => compareShipments(a, b, filters.sort));
}
