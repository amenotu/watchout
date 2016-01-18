/*
====================================
GAME SETUP
====================================
*/

var gameStats = {
	score: 0,
	bestScore: 0,
	collisions: 0
};

var gameOptions = {
	height: 550,
	width: 800,
	nEnemies: 30,
	padding: 20,
	radius: 10
};

var axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

// var startBtn = d3.select('.scoreboard')
//   .append("button")
//   .text("PLAY")
//   .attr("class", "startBtn");

var gameBoard = d3.select('.container')
  .append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

var board = gameBoard.append("rect")
  .attr('rx', 10)
  .attr('ry', 10)
  .attr('height', gameOptions.height)
  .attr('width', gameOptions.width)
  .attr('fill', 'white');


var updateScore = function(){
	d3.select('.scoreboard .current span').text(gameStats.score);
	d3.select('.scoreboard .high span').text(gameStats.bestScore);
	d3.select('.scoreboard .collisions span').text(gameStats.collisions);
};

var ready = function(){
	var answer = confirm("Are you ready to play? (Okay for yes, cancel for no)");
	if(answer){
		updateEnemies(enemies);
	    startScoring();
	} else {
		ready();
	}
};

window.addEventListener("load", function(event) {
    ready();
});

/*
====================================
PLAYER
====================================
*/


var playerPos = [gameOptions.width, gameOptions.height];
var player = d3.select('svg').append("svg:image")
  .attr("xlink:href", "spaceship.png")
  .attr("height", 60)
  .attr("width", 60)
  .attr("x", playerPos[0]/2 )
  .attr("y", playerPos[1]/2 )
  .attr("class", "player");


player.on("click", function(){
	gameBoard.on("mousemove", function(){
	  	playerPos = d3.mouse(this);
        d3.select(".player")
        .attr("x", playerPos[0] - 60/2)
        .attr("y", playerPos[1] - 60/2)
    });
});

/*
====================================
ENEMIES
====================================
*/

var randomX = function(){
	return Math.random() * gameOptions.width;
};

var randomY = function(){
	return Math.random() * gameOptions.height;
};

var enemyObj = function(){
	var obj = {};
	obj.x = randomX();
	obj.y = randomY();
	return obj;
};

var createEnemy = function(size){
	var enemies = [];
    for(var i = 0; i < size; i++){
        enemies[i] = new enemyObj();
    }
    return enemies;
};

var enemiesArr = createEnemy(gameOptions.nEnemies);



//put enemies on the board
var enemies = gameBoard
  .selectAll('image')
  .data(enemiesArr)
  .enter()
  .append("svg:image")
  .attr("xlink:href", "asteroid.png")
  .attr("x", function(d){ return axes.x(d.x) })
  .attr("y", function(d){ return axes.y(d.y) })
  .attr("height", 25)
  .attr("width", 25)
  .attr("class", "enemy");

var updateEnemies = function(element){
	element.transition()
	    .duration(1500)
	    .attr("x", function(d){ return d.x = randomX(); })
	    .attr("y", function(d){ return d.y = randomY(); })
	    .each("end", function(){
	    updateEnemies( d3.select(this) )
	    });
};

// startBtn.on('click', function(){
// 	updateEnemies(enemies);
// 	startScoring();
// });

/*
====================================
GAMESCORE UPDATER
====================================
*/

var scoreBoard = function(){
	gameStats.score = gameStats.score+1;
	gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
	updateScore();
};

var startScoring = function(){
	setInterval(scoreBoard, 500);
}


/*
====================================
COLLISION DETECTION
====================================
*/

var prevCollision = false;

var collisionsDetect = function(){
	var collision = false;

	enemies.each(function(){
		var cx = parseFloat(d3.select(this).attr("x")) + gameOptions.radius;
		var cy = parseFloat(d3.select(this).attr("y")) + gameOptions.radius;

		var x = cx - playerPos[0];
		var y = cy - playerPos[1];
		if(Math.sqrt( x*x + y*y ) < gameOptions.radius){
			collision = true;
		}
	});

	if(collision){
		player.attr("xlink:href", "explosion.png");
		gameStats.score = 0;
		gameStats.collisions = gameStats.collisions + 1;
	} else {
		player.attr("xlink:href", "spaceship.png");
	}
	prevCollision = collision;
};

d3.timer(collisionsDetect);




