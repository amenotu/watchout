// start slingin' some d3 here.
var gameStats = {
	score: 0,
	bestScore: 0,
	collisions: 0
};

var gameOptions = {
	height: 450,
	width: 700,
	nEnemies: 30,
	padding: 20
};

var axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);

var updateScore = function(){
	d3.select('.scoreboard .current').text
};

var xyOfEnemy = [];
var randomXY = function(){
	xyOfEnemy = [];
	for(var i = gameOptions.nEnemies; i >= 0; i--){
		var temp = [];
		temp[0] = Math.random() * gameOptions.width;
		temp[1] = Math.random() * gameOptions.height;
		xyOfEnemy[i] = temp;
	}
};

randomXY();

var enemies = gameBoard.selectAll("circle").data(xyOfEnemy).enter().append("circle").attr("cx", function(d){ return d[0]; }).attr("cy", function(d){ return d[1]; }).attr("r", 5).attr("class", "enemy");


var playerPos = [gameOptions.width, gameOptions.height];
var player = d3.select('svg').append("circle").attr("cx", playerPos[0]/2 ).attr("cy", playerPos[1]/2 ).attr("r", 10).attr('fill', 'red').attr("class", "player");

var updateEnemies = function(){
	gameBoard.selectAll(".enemy").data(xyOfEnemy).transition().duration(1000).attr('cx', function(d){return d[0]}).attr("cy", function(d){ return d[1]; });
};

setInterval(randomXY, 500);
setInterval(updateEnemies, 1000);


gameBoard.on("mousemove", function(){
  var loc = d3.mouse(this);
  d3.select(".player").attr("cx", loc[0]).attr("cy", loc[1]);
});


var scoreBoard = function(){
	gameStats.score = gameStats.score+1;
	gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
};





