self.addEventListener('fetch', function(event) {
    var url = event.request.url;
    if (url.indexOf('get-origin') != -1) {
      event.respondWith(new Promise(function(resolve) {
        resolve(new Response(JSON.stringify({
            origin: self.origin
          })));
        }));
    }
    else if (url.indexOf('fetch') != -1) {
      const url = new URL(event.request.url);
      event.respondWith(fetch(url.searchParams.get('url'), {mode: event.request.mode}));
    }
  });
