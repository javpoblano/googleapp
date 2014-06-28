var Host
(function($){
	Host = {
		socket : null,
		videoActual : null,
		reproductor : null,
		cola : null,
		el : {
			listaReproduccion : $("#lista-reproduccion"),
			vacio : $("#vacio")
		},
		
		iniciar : function(){
			this.conectarSocket();
			this.asociarEventos();
		},

		conectarSocket : function(){
			this.socket = io('/host');
		},

		asociarEventos : function(){
			this.socket.on('connect', $.proxy(this.pedirVideos, this))
			this.socket.on("videos", $.proxy(this.armarPlaylist, this));
			this.socket.on("agregar video", $.proxy(this.anadirVideo, this));

		},

		armarPlaylist : function(videos){
			this.cola = videos;
			var videoActual = null
			var htmlvid = ""

			if (videos !=  null || typeof videos != 'undefined') {
				if ( videos.length > 0) {
					htmlvid = armarFooter(videos, htmlvid)

					this.videoActual = videoActual;
					this.construirReproductor()
					this.el.listaReproduccion.append(htmlvid)
				}

				else{
					this.el.vacio.removeClass("hide")
				}
			}
			
			
		},

		pedirVideos : function(){
			this.socket.emit("pedir videos");
		},

		anadirVideo : function(video){
			if (this.videoActual == null) {
				this.videoActual = video.id;
				this.construirReproductor()
				this.el.vacio.addClass("hide")
			}

			this.cola.push(video)
			var html = buildVideo(video)
			this.el.listaReproduccion.append(html)
			
		},

		escapar : function(texto){
			return String(texto)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
		},

		construirReproductor : function(){
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}

	};
})(jQuery);