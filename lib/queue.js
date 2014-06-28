var helperUsuarios = require('../helpers/usuarios')

exports.conexion = function(socket, usuarios, mensajes, datos, videos, playlist,currentSong){
	var usuario = helperUsuarios.usuarioUnico(usuarios,datos.usuario)
	var temp = [];

	socket.usuario = usuario;
	temp.push(usuario);
	usuarios.push(usuario);
	
	socket.broadcast.emit('conexion',temp);
	socket.broadcast.emit('mensaje',[{
		'tipo' : 'sistema',
		'usuario' : null,
		'mensaje' : usuario + ' se ha unido'
	}]);

	socket.emit('conexion',usuarios, videos, currentSong);
	socket.emit('mensaje',mensajes);
};

exports.mensaje = function(socket, mensajes, usuario, datos, playlist){
	var mensaje = {
		'tipo' : 'normal',
		'usuario' : usuario,
		'mensaje' : datos.mensaje
	};

	playlist.emit('mensaje',[mensaje]);

	mensajes.push(mensaje);
};

exports.desconexion = function(socket,usuarios,usuario){
	usuarios.splice(usuarios.indexOf(usuario),1);

	socket.broadcast.emit('desconexion',{ usuario: usuario });
	socket.broadcast.emit('mensaje',[{
		'tipo' : 'sistema',
		'usuario' : null,
		'mensaje' : usuario + ' ha salido'
	}]);
};

exports.video = function(socket, usuario, datos, playlist, videos, hostU, currentSong){
	console.log("video")
	var video = {
		'tipo' : 'video',
		'usuario' : usuario,
		'id' : datos.idVideo,
		'img' : datos.preview,
		'nombre' : datos.nombre
	};

	if (videos.length < 1) {
		currentSong = video;
	}

	playlist.emit('agregar video', video, currentSong, videos);
	hostU.emit("agregar video", video, currentSong, videos);
	
	videos.push(video);

}