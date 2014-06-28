exports.usuarioUnico = function(usuarios, usuario){
	var aux = usuario, numero = 1;

	while (usuarios.indexOf(aux) !== -1){
		aux = [usuario,numero++].join('_');
	}

	return aux;
};