<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ads Tester</title>
    
    <!-- Video.js CSS -->
    <link href="https://vjs.zencdn.net/7.0/video-js.css" rel="stylesheet" />
    
    <!-- Video.js JavaScript -->
    <script src="https://vjs.zencdn.net/7.0/video.min.js"></script>

    <!-- Video.js contrib-ads (Para anuncios) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.8.0/videojs.ads.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.8.0/videojs.ads.css" rel="stylesheet">

</head>
<body>

    <video id="my-video" class="video-js" preload="auto" width="640" height="264" controls>
        <source src="video/mp4/oceans.mp4" type="video/mp4" />
        <p class="vjs-no-js">
            Para ver este video, habilita JavaScript o usa un navegador compatible con HTML5.
            <a href="https://videojs.com/html5-video-support/" target="_blank">Más info</a>
        </p>
    </video>

    <script src ="js/ads-mp4.js"></script>
    
</body>
</html>