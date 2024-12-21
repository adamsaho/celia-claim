document.addEventListener('DOMContentLoaded', () => {
  const connectBtn = document.getElementById('connectBtn');
  let isConnected = false;

  connectBtn.addEventListener('click', () => {
    isConnected = !isConnected;

    if (isConnected) {
      connectBtn.textContent = 'Connected';
      connectBtn.classList.add('connected');
    } else {
      connectBtn.textContent = 'Connect';
      connectBtn.classList.remove('connected');
    }
  });
});
