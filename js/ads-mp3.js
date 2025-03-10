// Esperar a que Video.js esté listo
var player = videojs('my-video', {}, function() {
    console.log("Video.js inicializado");

    // Inicializar ads
    player.ads();

    let midrollPlayed = false;
    let postRoll = false;
    let tiempoGuardado = 0; // Variable para guardar el tiempo antes del midroll

    // Para forzar el reinicio al darle a play después del postroll
    player.on('contentended', function() {
        player.one('play', function() {
                console.log('Reiniciando');
                player.currentTime(0);
                player.play();
        });
    }); 

    player.on('adstart', function() {
        console.log("Anuncio iniciado");
    
        // Crear botón de "Saltar anuncio"
        var skipButton = document.createElement('button');
        skipButton.innerText = "Saltar anuncio";
        skipButton.style.position = "absolute";
        skipButton.style.bottom = "40px";
        skipButton.style.right = "20px";
        skipButton.style.padding = "10px";
        skipButton.style.background = "rgba(0, 0, 0, 0.7)";
        skipButton.style.color = "white";
        skipButton.style.border = "none";
        skipButton.style.cursor = "pointer";
        skipButton.style.display = "none";
    
        player.el().appendChild(skipButton);
    
        // Mostrar botón después de 5 segundos
        setTimeout(function() {
            skipButton.style.display = "block";
        }, 5000);
    
        // Al hacer clic en el botón, saltar el anuncio
        skipButton.addEventListener('click', function() {
            console.log("Anuncio saltado");
            player.ads.endLinearAdMode();
            skipButton.remove();

            if (postRoll) {
                player.src({ src: "video/mp3/partidomp3.mp3", type:"audio/mp3" });
                player.trigger('ended');
            }
        });
    
        // Remover el botón cuando termine el anuncio
        player.on('adend', function() {
            console.log("Anuncio terminado");
            skipButton.remove();
        });
    });

    // PREROLL: Mostrar anuncio antes de iniciar el video
    player.on('readyforpreroll', function() {
        player.ads.startLinearAdMode();
        player.src({ src: "video/ads/spritemp3.mp3", type: "audio/mp3" });

        // Cuando el anuncio empiece, quitar el loader
        player.one('adplaying', function() {
            player.trigger('ads-ad-started');
        });

        // Cuando termine el anuncio, volver al video original
        player.one('adended', function() {
            player.ads.endLinearAdMode();
            player.src({ src: "video/mp3/partidomp3.mp3", type:"audio/mp3" });
        });
    });

    // MIDROLL: Anuncio en el segundo 10
    player.on('timeupdate', function() {
        var currentTime = player.currentTime();
        
        if (!midrollPlayed && currentTime >= 10) {
            midrollPlayed = true; // Evita que se vuelva a reproducir
            tiempoGuardado = currentTime; 

            player.ads.startLinearAdMode();
            player.src({ src: "video/ads/spritemp3.mp3", type: "audio/mp3" });

            player.one('adplaying', function() {
                player.trigger('ads-ad-started');
            });

            player.one('adended', function() {
                player.ads.endLinearAdMode();
                player.src({ src: "video/mp3/partidomp3.mp3", type:"audio/mp3" });

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
        player.on('readyforpostroll', function() {
            postRoll = true;
            player.ads.startLinearAdMode();
            player.src({ src: "video/ads/spritemp3.mp3", type: "audio/mp3" });

            player.one('adplaying', function() {
                player.trigger('ads-ad-started');
            });

            player.one('adended', function() {
                player.ads.endLinearAdMode();
                player.src({ src: "video/mp3/partidomp3.mp3", type:"audio/mp3" });
                player.trigger('ended');
            });
        });
    });

    player.trigger('adsready');
});