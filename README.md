# D3-Workshop

This is workshop for teaching D3.js fundamentals to Team Soso.

We'll start with a small sample piece of the WGW2015 dashboard we built, and you'll try to recreate it using new data from an API instead.

## 0) _Preámbulo_ (preamble)

- [D3-Handbook, only up to _The Basics_](https://github.com/sosolimited/D3-Handbook/blob/master/tour-of-d3.md)

## 1) _Sus Equipos_ (teams)

For teams that are in different offices, use Screenhero.

1. Alex, Justin
2. Jackie, David
3. John, Colin
4. Wes, Wade
5. Eric, JC

## 2) _El Punto de Partida_ (starting point)

- Starting page: original.html
	- This demonstrates simple D3 graphs, and uses a static data file which is a sample of old WGW data.
- Your new remix page: remix.html
	- On this page, you will recreate the original graphs, using the Rotten Tomatoes' movie API instead.
	- If you need some pointers, look at `/_example/remix.html` for an example remix (try not to, though!).

## 3) _Decompostura del Tutorial_ (breakdown)

1. JC will do a walkthrough of the original graphs (60 min)
2. Your team will pair program their remix graphs (30 min)
	- Choose about 5 movies you want to query from the API
	- Make your barchart
	- Make your piechart

##4 _Presentación_ (show & tell)

##5 _Notas_ (notes)

- System architecture
	- a basic __MVC architecture__ (Model, View, Controller) just for clarity & simplicity
		- __data.js__: a class for getting the data (aka. _API polling engine_) and transforming that data for our Views
		- __view.js__: a class for receiving prepared data, and creating visual things with it (aka. _D3 graphing engine_)
		- __controller.js__: a class that sets up the buttons, etc. on the page to complete certain actions/call functions
- More about APIs
	- an API is a piece of software that can talk to another piece of software, by taking a request in a certain format, and by responding with data in a certain format
	- a movie review API (like Rotten Tomatoes) takes a request where the parameters are the Title of the movie, or something else; it then responds by returning JSON data about that movie
	- API's can talk in almost any format and deal with any data that it stored somewhere. [So you can literally find an API about anything.](https://www.mashape.com/explore?page=1)
	- for this workshop, I simply Googled [`movie API json`](https://www.google.com/search?q=movie+API+json&oq=movie+api+json&aqs=chrome.0.69i59j69i60l2.1787j0j7&sourceid=chrome&es_sm=91&ie=UTF-8). See, it's the 1st result!
