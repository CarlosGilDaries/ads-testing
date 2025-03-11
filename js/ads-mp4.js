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
        skipButton.innerText = "Saltar en 5";
        skipButton.style.position = "absolute";
        skipButton.style.bottom = "40px";
        skipButton.style.right = "20px";
        skipButton.style.padding = "10px";
        skipButton.style.background = "rgba(0, 0, 0, 0.7)";
        skipButton.style.color = "white";
        skipButton.style.border = "none";
        skipButton.style.cursor = "pointer";
        skipButton.style.display = "block";
        skipButton.disabled = true;
    
        player.el().appendChild(skipButton);
    
        // Iniciar cuenta atrás del skipButton
        var countdown = 5;
        var countdownInterval;

        // Función para iniciar o reiniciar la cuenta atrás
        function startCountdown() {
            countdownInterval = setInterval(function() {
                if (!player.paused()) {  // Solo contar si el anuncio no está pausado
                    countdown--;
                    skipButton.innerText = "Saltar en " + countdown;
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        skipButton.innerText = "Saltar anuncio";
                        skipButton.disabled = false;
                    }
                }
            }, 1000);
        }

        startCountdown();

        // Saltar anuncio
        skipButton.addEventListener('click', function() {
            console.log("Anuncio saltado");
            player.ads.endLinearAdMode();
            skipButton.remove();

            if (postRoll) {
                player.src({ src: "video/mp4/oceans.mp4", type:"video/mp4" });
                player.trigger('ended'); 
            }
        });

        // Eliminar el botón cuando termine el anuncio
        player.on('adend', function() {
            console.log("Anuncio terminado");
            skipButton.remove();
            clearInterval(countdownInterval);  // Limpiar el intervalo al finalizar el anuncio
        });

        // Detener el contador cuando el anuncio está pausado
        player.on('pause', function() {
            clearInterval(countdownInterval);  
        });

        // Reiniciar la cuenta atrás si el anuncio se reanuda
        player.on('play', function() {
            if (!skipButton.disabled) {
                startCountdown();  
            }
        });
    });

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
        player.on('readyforpostroll', function() {
            postRoll = true;
            player.ads.startLinearAdMode();
            player.src({ src: "video/ads/sprite.mp4", type: "video/mp4" });

            player.one('adplaying', function() {
                player.trigger('ads-ad-started');
            });

            player.one('adended', function() {
                player.ads.endLinearAdMode();
                player.src({ src: "video/mp4/oceans.mp4", type:"video/mp4" });
                player.trigger('ended');         
            });
        });
    });

    player.trigger('adsready');
});