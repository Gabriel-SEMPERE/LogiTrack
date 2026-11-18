const API_URL = 'http://localhost:3000/api/v1';

async function readData(response) {
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export async function getShipments() {
  const response = await fetch(`${API_URL}/shipments`);
  return readData(response);
}

export async function updateShipment(id, changes) {
  const response = await fetch(`${API_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  return readData(response);
}
