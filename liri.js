var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var spotifyClient = new Spotify(keys.spotifyKeys);

var twitterClient= new twitter(keys.twitterKeys);
 


var command = process.argv[2];
var arg = process.argv[3];

function runLiri() {
    switch (command) {
        case "my-tweets":
            console.log("my-tweets");
            tweetLookup();
            break;

        case "spotify-this-song":
            console.log("spotify-this-song");
            songLookup(arg);
            break;

        case "movie-this":
            console.log("movie-this");
            movieLookup(arg);
            break;

        case "do-what-it-says":
            console.log("do-what-it-says");
            demo();
            break;
    };
};

runLiri();

function tweetLookup(){
	twitterClient.get('statuses/user_timeline', function(error, tweets, response) {
  if(error) throw error;
  for (t=0;t<20;t++){
  console.log("\ntweet: "+tweets[t].text+"\nTimestamp: "+tweets[t].created_at);  
};
});
};



function movieLookup(arg) {
    // Then run a request to the OMDB API with the movie specified
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + arg + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(movieQueryUrl);

    request(movieQueryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating


            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Production Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
};

function songLookup(arg){
spotifyClient.search({ type: 'track', query: arg }, function(err, data) {
  if (err) {
    return console.log(err);
  }
 
var artist = data.tracks.items[0].artists[0].name; 
var album = data.tracks.items[0].album.name ;
var songName = data.tracks.items[0].name;
var songUrl = data.tracks.items[0].preview_url;

console.log("Artist: " + artist + "\nSong Name: " + songName +
  "\nAlbum Name: " + album + "\nPreview URL: " + songUrl);
  console.log("---------------");

});
};


function demo() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }

        // Break the string down by comma separation and store the contents into the output array.
        var output = data.split(", ");
        command = output[0],
            arg = output[1];
            console.log(arg);
            console.log(command);
        runLiri();
    })
};