// Esperar a que Video.js esté listo
var player = videojs('my-video', {}, function() {
    console.log("Video.js inicializado");

    // Inicializar ads
    player.ads();

    let midrollPlayed = false;
    let tiempoGuardado = 0; // Variable para guardar el tiempo antes del midroll

    // PREROLL: Mostrar anuncio antes de iniciar el video
    player.on('readyforpreroll', function() {
        player.ads.startLinearAdMode();
        player.src({ src: "video/ads/sprite.mp4", type: "video/mp4" });

        // Cuando el anuncio empiece, quitar el loader
        player.one('adplaying', function() {
            player.trigger('ads-ad-started');
        });

        // Cuando termine el anuncio, volver al video original
        player.one('adended', function() {
            player.ads.endLinearAdMode();
            player.src({ src: "video/mp4/oceans.mp4", type:"video/mp4" });
        });
    });

    // MIDROLL: Anuncio en el segundo 10
    player.on('timeupdate', function() {
        var currentTime = player.currentTime();
        
        if (!midrollPlayed && currentTime >= 10) {
            midrollPlayed = true; // Evita que se vuelva a reproducir
            tiempoGuardado = currentTime; 

            player.ads.startLinearAdMode();
            player.src({ src: "video/ads/sprite.mp4", type: "video/mp4" });

            player.one('adplaying', function() {
                player.trigger('ads-ad-started');
            });

            player.one('adended', function() {
                player.ads.endLinearAdMode();
                player.src({ src: "video/mp4/oceans.mp4", type:"video/mp4" });

                // Escuchar el evento 'loadedmetadata' para asegurarse de que los metadatos del video estén cargados
                player.one('loadedmetadata', function() {
                    player.currentTime(tiempoGuardado);
                    player.play();
                });
            });
        }
    });

    //POSTROLL: Anuncio al finalizar el vídeo
    player.on('contentended', function() {    
        player.currentTime(0);

        player.on('readyforpostroll', function() {
            player.ads.startLinearAdMode();
            player.src({ src: "video/ads/sprite.mp4", type: "video/mp4" });

            player.one('adplaying', function() {
                player.trigger('ads-ad-started');
            });

            player.one('adended', function() {
                player.ads.endLinearAdMode();
                player.src({ src: "video/mp4/oceans.mp4", type:"video/mp4" });
                player.currentTime(0);
                player.trigger('ended');
                player.pause();          
            });
        });
    });

    player.trigger('adsready');
});