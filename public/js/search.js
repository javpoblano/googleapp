// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

var nextPageToken = ""
var input = ""

// Helper function to display JavaScript value on HTML page.
function setUpVideo(img, id, title, name){
    return  "<div class='large-3 small-6 medium-4 xlarge-2 columns video-container radius'>" +
                "<div class='video'>" +
                    "<img src=" + img["medium"]["url"] + ">"+
                    //"<img src='"+ img +"'>" +                  
                    "<div class='info'>" + 
                        "<div class='play'>"+
                            "<a href='#' class='add-btn text-center'>"+
                                "<i class='fi-play-circle' data-id='"+id+"' data-img='"+img["medium"]["url"]+"' data-name='"+ name +"'></i>"+
                            "</a>"+
                        "</div>"+ 
                    "</div>" +
                "</div>" +
                "<div class='descripcion'>" +
                    "<p>"+title+"</p>" +
                "</div>" +
            "</div>"
}


function showResponse(response) {
    console.log( JSON.stringify(response, "",4));
    var items = response["items"]
    //console.log( JSON.stringify( items, '', 4));
    var videos = ""
    nextPageToken = response["nextPageToken"] 
    $.each(response["items"], function(i, item) {
        if(item["id"]["kind"] == "youtube#video"){
            var id = item["id"]["videoId"]
            var title = item["snippet"]["title"]
            var description = item["snippet"]["description"]
            var img = item["snippet"]["thumbnails"]
            var name = item["snippet"]["title"]

            videos += setUpVideo(img,id,title, name)
        }
    })

    //var responseString = JSON.stringify(response, '', 2);
    //document.getElementById('resultado').innerHTML += responseString;
    document.getElementById('resultado').innerHTML += videos;
    $("#retrieve").addClass("button").removeClass("hide");
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyDlGriq7thhvSQAlNWJuI7I9PruTusf8y0');
}

function search(text) {
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q   :  text,
        //q: "nine inch nails", 
        maxResults : 10,
        pageToken: nextPageToken,
        type : "video",
        videoEmbeddable : "true"
    });
    
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}

$(document).ready(function(){

    $("#buscador").submit(function(event){
        event.preventDefault();
        $("#search").trigger("click")
    })


    $("#search").click(function(event){
         event.preventDefault()
        input = $("#input-text").val()
        nextPageToken  = ""
        $("#resultado").html("")
        search(input)
    })

    $("#retrieve").click(function(event){
        event.preventDefault()
        search(input)
    })
})