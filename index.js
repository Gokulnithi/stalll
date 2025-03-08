import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAJy05gaz0bxoRIrcJ6XifC8-0qkUV_p_8",
  authDomain: "e-horyzon-stall.firebaseapp.com",
  projectId: "e-horyzon-stall",
  storageBucket: "e-horyzon-stall.firebasestorage.app",
  messagingSenderId: "799508559240",
  appId: "1:799508559240:web:9aec96db018128239f763d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const h1 = document.createElement('h1');
const rb = document.getElementById('re');
h1.className = 'result';

const scanner = new Html5QrcodeScanner('reader', {
    qrbox: { width: 250, height: 250 },
    fps: 20
});

scanner.render(success, error);

function success(res) {
    scanner.clear();
    showLoader();  
    checkQRCode(res);
    document.getElementById('reader').replaceWith(h1);
}

function error(err) {
    console.log(err);
}

function showLoader() {
    h1.innerHTML = `<div class="loader"></div>`;
}

function hideLoader() {
    document.querySelector(".loader")?.remove();
}

function checkQRCode(code) {
    const docRef = doc(db, "coupons", code);
    
    getDoc(docRef).then((docSnap) => {
        hideLoader();  // Hide loader after response
        if (docSnap.exists()) {
            if (docSnap.data().used) {
                h1.innerHTML = "<p style='color: red;'>❌ Code already used!</p>";
            } else {
                h1.innerHTML = "<p style='color: green;'>✅ Discount Applied!</p>";
                updateDoc(docRef, { used: true });
            }
        } else {
            h1.innerHTML = "<p style='color: red;'>❌ Invalid QR Code!</p>";
        }
    }).catch((error) => {
        hideLoader();
        console.error("Error checking QR code:", error);
    });
}

rb.addEventListener('click', () => {
    window.location.reload();
});

const style = document.createElement('style');
style.innerHTML = `
    .loader {
        border: 6px solid #FF4C4C;
        border-top: 6px solid #FFDE4D;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
