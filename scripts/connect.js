// script.js
document.getElementById('connect-btn').addEventListener('click', async function() {
    const overlay = document.getElementById('overlay');
    const mobileMessage = document.getElementById('mobile-message');
    const desktopContent = document.getElementById('desktop-content');

    overlay.classList.remove('hidden');

    if (isMobileDevice()) {
        mobileMessage.classList.remove('hidden');
    } else {
        desktopContent.classList.remove('hidden');
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            window.location.href = `/dashboard?wallet=${walletAddress}`;
        } catch (error) {
            console.error('MetaMask connection failed:', error);
            alert('MetaMask connection failed. Check if the extension is installed.', error);
        } finally {
            overlay.classList.add('hidden');
        }
    }
});

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}