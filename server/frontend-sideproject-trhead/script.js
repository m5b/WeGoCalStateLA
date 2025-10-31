// script.js
import crypto from 'crypto';

let showAnonymus = false;

// Fetch and display existing threads
fetch('http://localhost:3001/api/data')
  .then(response => response.json())
  .then(data => displayThreads(data))
  .catch(error => console.error('Error fetching data:', error));

// Handle form submission
document.getElementById('threadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const idType = formData.get('idType');
  const username = formData.get('username');
  const thread = formData.get('thread');
  let idValue = idType === 'id_anonymus' ? crypto.randomBytes(16).toString('hex') : null;

  fetch('http://localhost:3001/api/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, thread, idValue, idType })
  })
  .then(response => response.json())
  .then(data => {
    displayThreads([data]); // Add new thread to display
    this.reset(); // Clear the form
    document.querySelector('input[name="idType"][value="id"]').checked = true; // Reset to default ID
  })
  .catch(error => console.error('Error submitting data:', error));
});

// Toggle between id and id_anonymus
export function toggleIdType() {
  showAnonymus = !showAnonymus;
  const button = document.querySelector('.toggle-btn');
  button.textContent = showAnonymus ? 'Show ID' : 'Show ID Anonymus';
  refreshThreads();
}

// Display or refresh threads based on toggle state
function displayThreads(threads) {
  const list = document.getElementById('threadList');
  list.innerHTML = ''; // Clear current threads
  fetch('http://localhost:3001/api/data')
    .then(response => response.json())
    .then(allThreads => {
      allThreads.threads.forEach(item => { // Updated to access threads array
        const div = document.createElement('div');
        div.className = 'thread';
        div.innerHTML = `
          <span class="username">${item.username}</span>
          <span class="id">${showAnonymus ? `(ID: ${item.id_anonymus || 'N/A'})` : `(ID: ${item.id})`}</span>
          <div class="content">${item.thread}</div>
        `;
        list.appendChild(div);
      });
    })
    .catch(error => console.error('Error refreshing threads:', error));
}

// Refresh threads on toggle
function refreshThreads() {
  fetch('http://localhost:3001/api/data')
    .then(response => response.json())
    .then(data => displayThreads(data))
    .catch(error => console.error('Error refreshing threads:', error));
}