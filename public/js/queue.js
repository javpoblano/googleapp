var Playlist
(function($){
	Playlist = {
		socket : null,
		usuario : null,
		listaReproduccion : null,
		cancionActual : null,
		el : {
			listaUsuarios : $('#conectados ul'),
			listaReproduccion : $('#lista-reproduccion'),
			botonEnviar : null
		},
		
		iniciar : function(){
			this.conectarSocket();
			this.asociarEventos();
		},

		conectarSocket : function(){
			this.socket = io('/playlist');
		},

		asociarEventos : function(){
			this.socket.on('desconexion', $.proxy(this.eliminarUsuarioDeChat, this));
			this.socket.on('mensaje', $.proxy(this.anadirMensaje, this));
			this.socket.on('agregar video', $.proxy(this.anadirVideo, this));
			this.socket.on('conexion', $.proxy(this.anadirUsuarioAChat, this));
			$(document).on('click', '.add-btn', $.proxy(this.enviarVideo, this ) )
		},

		enviarConexion : function(usuario){
			this.usuario = usuario;
			this.socket.emit('conectar', { usuario: this.usuario });
		},

		anadirUsuarioAChat : function(datos, videos, currentSong){
			var html = '';
			var htmlvid = '';

			$.each(datos,function(i,usuario){
				html += '<li>' + usuario + '</li>';
			});

			if (videos !=  null || typeof videos != 'undefined') {
				if ( videos.length > 0) {
					htmlvid = armarFooter(videos, htmlvid)
				}
			}

			this.cancionActual = currentSong;
			this.el.listaUsuarios.append(html);
			this.el.listaReproduccion.append(htmlvid)
		},

		eliminarUsuarioDeChat : function(datos){
			this.el.listaUsuarios.find('li').filter(function(){
				return datos.usuario === $(this).text()
			}).remove();
		},

		anadirMensaje : function(mensajes){
			var html = '';

			$.each(mensajes, function(i, mensaje){
				var clase = mensaje.tipo ? ' class="'+ mensaje.tipo +'"' : '';
				html += '<p'+clase+'>';
				if (mensaje.usuario) {
					html += '<strong>' + mensaje.usuario + '</strong>: ';
				}
				html += mensaje.mensaje;
			});

			this.el.listaUsuarios.append(html);
		},

		anadirVideo : function(video){
			html = buildVideo(video);
			this.el.listaReproduccion.append(html);
		},

		enviarVideo : function(e){
			e.preventDefault();

			this.socket.emit('video', {
				idVideo : this.escapar( e.target.getAttribute("data-id") ),
				preview : e.target.getAttribute("data-img"),
				nombre : e.target.getAttribute("data-name")
			});
		},

		enviarMensaje : function(e){
			e.preventDefault();

			this.socket.emit('mensaje', {
				mensaje : this.escapar( e.target.getAttribute("data-id") )
			});
		},

		escapar : function(texto){
			return String(texto)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
		}

	};
})(jQuery);