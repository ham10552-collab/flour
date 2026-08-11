self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(clients.claim());});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req).then(function(r){
        var cl=r.clone();
        caches.open('flour-v1').then(function(c){c.put(req,cl);});
        return r;
      }).catch(function(){
        return caches.match(req).then(function(h){return h||caches.match('./');});
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function(h){
      if(h)return h;
      return fetch(req).then(function(r){
        if(r.ok){var cl=r.clone();caches.open('flour-v1').then(function(c){c.put(req,cl);});}
        return r;
      });
    })
  );
});
