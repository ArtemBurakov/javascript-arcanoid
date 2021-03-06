//set initial data values
vausLeft = 395;
score = 0;
live = 10;
level = 0;

//ball
ball = {top: 620, left: 498};
ballSpeed = {top: -2, left: 2};
ballMoving = false;

//ball move interval
movement = null;

//affected block number
affectedNumber = 0;

direction = null;

//load levels data
levelBlocks = [];
loadLevelsData(1);

function loadLevelsData(levelNumber){
    var xmlhttp = new XMLHttpRequest();
	var url = 'levels/'+levelNumber+'.json';
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4){
	    	if (this.status == 200){
	        	levelBlocks[(levelNumber-1)] = JSON.parse(this.responseText);
	        	loadLevelsData(levelNumber+1);
	        }
	        else{
	    		buildBlocks();
	        }
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

//build blocks
function buildBlocks(){
	for (var i = 0; i < levelBlocks[level].length; i++){
		var ele = document.createElement("div");
	        ele.setAttribute("id",'block'+ i);
	        ele.setAttribute("class","block");
	        ele.style.top = levelBlocks[level][i].top + 'px';
	        ele.style.left = levelBlocks[level][i].left + 'px';
	        ele.style.background = levelBlocks[level][i].color;

        document.body.appendChild(ele);
    }

    //display score/live/level
    document.getElementById("score").innerHTML = score;
    document.getElementById("live").innerHTML = live;
    document.getElementById("level").innerHTML = level + 1;

	window.onkeydown = keyProgram;
}

//reset game
function resetGame(){
	if (live == 0){
		alert('Game over');
		window.location.reload();
	}

	//clear interval
	clearInterval(movement);
	ballMoving = false;

	//reset ball position
	ball = {top: 620, left: 498};
	document.getElementById('ball').style.left = ball.left;
	document.getElementById('ball').style.top = ball.top;

	//reset vaus position
	vausLeft = 395;
	document.getElementById('vaus').style.left = vausLeft;

	//reset button
	document.getElementById('start').style.display = '';
	document.getElementById('restart').style.display = 'none';
}

function keyProgram(e){
	//left Arrow
    if (e.keyCode == 37){
    	moveVausLeft();
    }
	//right Arrow
    if (e.keyCode == 39){
    	moveVausRight();
    }
	//space
    if (e.keyCode == 32 || e.charCode == 32){
    	startBall();
    }
}

function moveVausLeft(){
	vausLeft = vausLeft - 75;

	//left range
	if (vausLeft < 10){
		vausLeft = 10
	}
	document.getElementById('vaus').style.left = vausLeft;

	//move ball with Vaus
	if (ballMoving == false){
		ball.left = ball.left - 75;
		if (ball.left < 110){
			ball.left = 110
		}
		document.getElementById('ball').style.left = ball.left;
	}
}

function moveVausRight(){
	vausLeft = vausLeft + 75;

	//right range
	if (vausLeft > 834){
		vausLeft = 834
	}
	document.getElementById('vaus').style.left = vausLeft;

	//move ball with Vaus
	if (ballMoving == false){
		ball.left = ball.left + 75;
		if (ball.left > 930){
			ball.left = 930
		}
		document.getElementById('ball').style.left = ball.left;
    }
}

function startBall(){
	//set interval on moveBall function
	movement = setInterval(moveBall, 6);
	ballMoving = true;
}

function moveBall(){
	//set new coordinates
	ball.left = ball.left + ballSpeed.left;
	ball.top = ball.top + ballSpeed.top;

	//check place
	isFree = checkPlace();

	if (isFree !== 'free'){
		//need to change the direction of the ball

		//vertical return
		ball.top = ball.top - ballSpeed.top;

		//check again
		if (checkPlace() !== 'free'){
			if (isFree == 'block'){
				//if block
				removeBlocks();

				//if there are more bricks
				checkBlocks();
			}
			//horizontal return
			returnHorizontal();
		} else{
			if (isFree == 'block'){
				//if block
				removeBlocks();

				// //if there are more bricks
				checkBlocks();
			}
			//vertical return
			returnVertical();
		}

		//horizontal return
		ball.left = ball.left - ballSpeed.left;
	} else{
		document.getElementById('ball').style.left = ball.left;
		document.getElementById('ball').style.top = ball.top;
	}
}

function returnVertical(){
	direction = 'vertical';
	//change the increment to the opposite
	ballSpeed.top = -ballSpeed.top;

	ball.left = ball.left + ballSpeed.left;
	ball.top = ball.top + ballSpeed.top;
}

function returnHorizontal(){
	direction = 'horizontal';
	//change the increment to the opposite
	ballSpeed.left = -ballSpeed.left;

	ball.left = ball.left + ballSpeed.left;
	ball.top = ball.top + ballSpeed.top;
}

//checks if this place is free
function checkPlace(){
	//if the coordinates are outside the field
	if (ball.left >= 1024){ return 'wall' }
	if (ball.left <= 20){ return 'wall' }
	if (ball.top <= 140){ return 'wall' }

	//if the ball is at the bottom of the field
	if (ball.top > 620){
		if (ball.left > vausLeft && ball.left < vausLeft + 200){
			return 'vaus';
		} else{
			//update live
			live = live-1;
			document.getElementById("live").innerHTML = live;
			resetGame();
			return 'free';
		}
	}

    //check each block one by one
	for (x in levelBlocks[level]){
		if (levelBlocks[level][x]['visibility'] == true){
			//if the ball falls vertically into the brick zone
			if (ball.top > levelBlocks[level][x]['top'] && ball.top < levelBlocks[level][x]['top'] + 30){
				//and horizontally
				if (ball.left > levelBlocks[level][x]['left'] && ball.left < levelBlocks[level][x]['left'] + 100){
					//remember affected brick
					affectedNumber = x;
					return 'block';
				}
			}
		}
	};
	return 'free';
}

function removeBlocks(){
	//green block
	if (document.getElementById('block' + affectedNumber).style.background == 'green'){
		document.getElementById('block' + affectedNumber).style.background = 'blue'
		return;
	}
	//blue block
	if (document.getElementById('block' + affectedNumber).style.background == 'blue'){
		document.getElementById('block' + affectedNumber).style.background = 'yellow'
		return;
	}
	//yellow block
	if (document.getElementById('block' + affectedNumber).style.background == 'yellow'){
		score = score+1;

		document.getElementById("score").innerHTML = score;
		document.getElementById('block' + affectedNumber).style.background = 'red'
		return;
	}
	//red block
	if (document.getElementById('block' + affectedNumber).style.background == 'red'){
		levelBlocks[level][affectedNumber]['visibility'] = false;
		document.getElementById('block' + affectedNumber).style.display = 'none';
		return;
	}
}

function checkBlocks(){
	for (x in levelBlocks[level]){
		if (levelBlocks[level][x].visibility == true){
			return;
		}
	}
	//level passed
	level = level + 1;
	alert('Level ' + (level + 1));
	resetGame();
	buildBlocks();

	//remove all affected blocks
	for (var i = 0; i < levelBlocks[level-1].length; i++){
		var ele = document.getElementById('block' + i);
		if (ele.style.display == 'none'){
			ele.parentNode.removeChild(ele);
		} else{
			return;
		}
	}

	if (direction == 'horizontal'){
		returnHorizontal();
	} else{
		returnVertical();
	}
}
