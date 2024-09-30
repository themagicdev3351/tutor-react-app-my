importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBwxyosx7GnNGVYxeZyHhJH-KNjo3-UQfA",
    authDomain: "instaxpert.firebaseapp.com",
    projectId: "instaxpert",
    storageBucket: "instaxpert.appspot.com",
    messagingSenderId: "851631088009",
    appId: "1:851631088009:web:f13854e2aeef0dea4c4158",
    measurementId: "G-H4RLLNE21Q"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

if (firebase.messaging.isSupported()) {
    const messaging = firebase.messaging();

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);

        // Customize the notification here
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon || '/firebase-logo.png',
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
} else {
    console.log("Firebase Messaging is not supported in this browser.");
}
