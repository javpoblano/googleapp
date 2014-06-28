function armarFooter(videos, htmlvid){
	$.each(videos, function(i, video){
		if (i == 0) {
			videoActual = video.id;
		}
		htmlvid += buildVideo(video)
		
	})

	return htmlvid;
}

function buildVideo(video){
	return  "<div class='item-queue usuario "+ video.usuario +"'>" +
				"<img src='"+ video.img+ "'>" +
				"<div><p>"+ video.nombre+ "</p></div>" +
			"</div>";
}