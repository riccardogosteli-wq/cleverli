self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Cleverli", {
      body: data.body || "Vergiss deine tägliche Aufgabe nicht! ⚡",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url: data.url || "/daily" },
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
