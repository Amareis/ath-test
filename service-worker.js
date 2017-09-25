self.addEventListener('install', function() {
    self.skipWaiting()
})

self.addEventListener('fetch', function(e) {
    e.respondWith(caches.match(e.request).then(function(response) {
        if (response !== undefined) {
            return response
        } else {
            return fetch(e.request).then(function (resp) {
                const clone = resp.clone()
                caches.open('test').then(function (cache) {
                    cache.put(e.request, clone)
                })
                return resp
            }).catch(function () {
                return response
            })
        }
    }))
})

self.addEventListener('activate', function(event) {
    event.waitUntil(
        self.clients.claim().then(caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                return caches.delete(key)
            }))
        }))
    )
})
