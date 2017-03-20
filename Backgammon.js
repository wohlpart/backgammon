//the game starts as being displayed in 3d at an angle
//to play the game, hit the play game button which
//will translate the view to overhead the board
//to move a piece, click on the piece and then click on the space 
//you want to move it to
//to view the game in 3d again at any point you can  click the play game button again
//the roll button will display 2 random values between 1 and 6 when clicked
//to stimulate rolling a di
var canvas;
var gl;
var colorLoc;
var modelViewLoc;
var projectionLoc;

var vertices = [];
var colors = [];
var indices = [];
var theta = [];

var boardSize = 20;
var boardSize2 = boardSize / 2.0;
var boardWidth = 10;
var boardHeight = 5;
var windowMin = -boardSize2;
var windowMax = boardSize + boardSize2;

var projection;
var modelView;
var aspect;
var play = false;
var yVal = 5.01;

var triVert = [];

var pips = [];
var pips2 = [];
var first = true;
var pipIndex = 0;



var change;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas");
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Load vertices and colors for cube faces
	var a = document.getElementById ("play game");
	a.addEventListener( "click", function() { play = !play ; });
	
	var b = document.getElementById("roll");
	b.addEventListener("click", function(){
		var j = Math.floor(Math.random() * 6) + 1;
		var k = Math.floor(Math.random() * 6) + 1;
		b.textContent = j+", " +k;
	});
	
	

	
	for (var i = 0; i < 4; i++){
		pips.push(vec4(-boardSize2 +  (9.5/12), yVal, .4+ .85*i, 0));
	}
	
	for (var i = 0; i < 2; i++){
		pips.push(vec4(-boardSize2 + (9.5/12)+(9.5*4/6),yVal, 9.6-.85*i, 0));
	}
	
	for(var i = 0; i < 4; i ++){
		pips.push(vec4(boardSize2 - (9.5/12)-(9.5*5/6) , yVal, 9.6-.85*i, 0));
	}
	
	for (var i = 0; i < 1; i++){
		pips.push(vec4(boardSize2 -  (9.5/12), yVal, .4+ .85*i, 0));
	}
	
	for (var i = 0; i < 4; i++){
		pips2.push(vec4(-boardSize2 +  (9.5/ 12), yVal, 9.6 - .85*i, 0));
	}
	
	for (var i = 0; i < 1; i++){
		pips2.push(vec4(boardSize2 -  (9.5/ 12), yVal, 9.6 - .85*i, 0));
	}
	
	for (var i = 0; i < 4; i++){
		pips2.push(vec4(boardSize2 - (9.5/12)-(9.5*5/6), yVal, .4+ .85*i, 0));
	}
	
	for (var i = 0; i < 2; i++){
		pips2.push(vec4(-boardSize2 + (9.5/12)+(9.5*4/6), yVal, .4+ .85*i, 0));
	}
	

	load();
//	if (play)
	clickListener();
	
    //
    //  Configure WebGL
	buffer();
	
    render();
};

function clickListener(){
	canvas.addEventListener("click", function (event){
		console.log(event.clientY);
		
		pX =((event.clientX - 30)* (20/455)) -10;
		pZ =((event.clientY - 190) * (10/225));
		console.log(pX);
		console.log(pZ);
	
		if (first){
			var found = false;
			
			for (var i = 0; i < pips.length; i++){
				if (pips[i][0] + .4 > pX && pips[i][0] - .4 < pX
					&& pips[i][2] + .4 > pZ && pips[i][2] - .4 < pZ){
						change = pips[i];
						found = true;						
					}
			}
			for (var i = 0; i < pips2.length; i++){
				if (pips2[i][0] + .4 > pX && pips2[i][0] - .4 < pX
					&& pips2[i][2] + .4 > pZ && pips2[i][2] - .4 < pZ){
						change = pips2[i];
						found = true;						
					}
			}
			
			if (found){
				first = false;
			}
			
		}else{
			pX =((event.clientX - 30)* (20/455)) -10;
			pZ =((event.clientY - 190) * (10/225));
			var newP = findPoint(pX, pZ);
			change[0] = newP[0];
			change[1] = change[1];
			change[2] = newP[1];
			replaceCube(change[0], change[1], change[2], .3, change[3] );
			first = true;
			change = false;
			buffer();
		}
		
		
	});
};

function findPoint(pX, pZ){
	nX = pX;
	nY = pZ;
	
	for (var i = 0;i < 6; i++){
		if (pX <= boardSize2- i*(9.5/6) && pX > boardSize2- (i + 1) * (9.5/6)){
			nX = boardSize2 - 9.5/12 - i*(9.5/6);
		}
	}
	for (var i = 0;i < 6; i++){
		if (pX >= -boardSize2+ i*(9.5/6) && pX < -boardSize2+ (i + 1) * (9.5/6)){
			nX = -boardSize2 + 9.5/12 + i*(9.5/6);
		}
	}
	
	return vec2(nX, nY);
};
function replaceCube(xCor,yCor,zCor, radi, start){
		
	vertices[start] =vec4(xCor-radi, yCor , zCor+radi,1);
	vertices[start+1] = vec4(xCor-radi,yCor + .35, zCor + radi,1);
	vertices[start + 2] = vec4(xCor + radi, yCor + .35, zCor + radi, 1);
	vertices[start + 3] = vec4(xCor + radi, yCor, zCor + radi, 1.0);
	vertices[start + 4] = vec4(xCor - radi, yCor, zCor-radi, 1.0);
	vertices[start + 5] = vec4(xCor - radi, yCor + .35, zCor - radi, 1.0);
	vertices[start + 6] = vec4(xCor + radi, yCor + .35, zCor - radi, 1.0);
	vertices[start + 7] =vec4(xCor + radi, yCor, zCor - radi, 1.0);	
	
};

function buffer(){
	    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect = canvas.width / canvas.height;
    gl.clearColor( 0.7, 0.7, 0.7, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	//projection = ortho (windowMin, windowMax, windowMin, windowMax, windowMin, windowMax+boardSize);
	// Register event listeners for the buttons
	

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	colorLoc = gl.getUniformLocation (program, "color");
	modelViewLoc = gl.getUniformLocation (program, "modelView");
	projectionLoc  = gl.getUniformLocation (program, "projection");
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
};


function render3D(){
	looking = lookAt (vec3(0,(10/3)*boardSize2,boardSize), vec3(0,0,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (40.0, aspect, 10, 10*boardSize);
	modelView = looking;
	
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
};

function render2D(){
	
	looking = lookAt (vec3(0,40,5), vec3(0,0,5), vec3(0.0, 0.0, -1));
	projection = perspective (35.0, aspect, 10, 30*boardSize);
	modelView = looking;
	
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
};


function render(){
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if(play){
		render2D();
	}else{
		render3D();
	}
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i);
	}
	
	for (var i=0; i<12; i++) {
		var j  = i% 2;
		gl.uniform4fv (colorLoc, colors[j + 4]);
		gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 36+ 3*i);
	}
	
	for (var i=0; i<12; i++) {
		var j  = i% 2;
		gl.uniform4fv (colorLoc, colors[j + 1]);
		gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 36*2 + 3*i);
	}
	
	for (var j = 0; j < pips.length; j++){
		for (var i=0; i<6; i++) {
			gl.uniform4fv (colorLoc, colors[8]);
			gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 36*(3 + j) + 6*i );
		}
	}
	
	for (var j = 0; j < pips2.length; j++){
		for (var i=0; i<6; i++) {
			gl.uniform4fv (colorLoc, colors[7]);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 36*(3 + pips.length + j) + 6*i);
		}
	}
	
	requestAnimFrame (render);
};
function load(){
	vertices = [
	   vec4(-boardSize2, 0.0, boardWidth, 1.0),
	   vec4(-boardSize2, boardHeight, boardWidth, 1.0),
	   vec4(boardSize2, boardHeight, boardWidth, 1.0),
	   vec4(boardSize2, 0.0, boardWidth, 1.0),
	   vec4(-boardSize2, 0.0, 0.0, 1.0),
	   vec4(-boardSize2, boardHeight, 0.0, 1.0),
	   vec4(boardSize2, boardHeight, 0.0, 1.0),
	   vec4(boardSize2, 0.0, 0.0, 1.0),
	];
	 colors = [
	    vec4(238/255, 130/255, 230/255, 1.0),  // pink
		vec4(0, 0.0, 0.0, 1.0),  // yellow
		vec4(1.0, 1.0, 1.0, 1.0),  // green
		vec4(75/255,0,130/255, 1.0),  // purple
		vec4(1.0, 1.0, 1.0, 1.0),  // magenta
		vec4(0, 0.0, 0.0, 1.0), 
		vec4(0.0, 1.0, 1.0, 1.0) ,		// cyan
		vec4(51/255,51/255,1,1), //purple
		vec4(178/255,102/255,1,1) // light purple
	];
		
	
	//vertices.push(triVert);
	for (var i = 0; i < 6; i++){
		vertices.push(vec4(-boardSize2 + (9.5/6)*i,5.01,0,1));
		vertices.push(vec4(-boardSize2 + (9.5/6)*(i+1),5.01,0,1));
		vertices.push(vec4(-boardSize2 +  (9.5/6)*i +(9.5/12),5.01, 4.5,1));
	}
	
	for (var i = 0; i < 6; i++){
		vertices.push(vec4(boardSize2 - (9.5/6)*i,5.01,0,1));
		vertices.push(vec4(boardSize2 - (9.5/6)*(i+1),5.01,0,1));
		vertices.push(vec4(boardSize2 -  (9.5/6)*i -(9.5/12),5.01, 4.5,1));
	}
	
	for (var i = 0; i < 6; i++){
		vertices.push(vec4(-boardSize2 + (9.5/6)*i,5.01,10,1));
		vertices.push(vec4(-boardSize2 + (9.5/6)*(i+1),5.01,10,1));
		vertices.push(vec4(-boardSize2 +  (9.5/6)*i +(9.5/12),5.01, 5.5,1));
	}
	
	for (var i = 0; i < 6; i++){
		vertices.push(vec4(boardSize2 - (9.5/6)*i,5.01,10,1));
		vertices.push(vec4(boardSize2 - (9.5/6)*(i+1),5.01,10,1));
		vertices.push(vec4(boardSize2 -  (9.5/6)*i -(9.5/12),5.01, 5.5,1));
	}
	
	
	// Load indices to represent the triangles that will draw each face
	
	indices = [
	   1, 0, 3, 3, 2, 1,  // front face
	   2, 3, 7, 7, 6, 2,  // right face
	   3, 0, 4, 4, 7, 3,  // bottom face
	   6, 5, 1, 1, 2, 6,  // top face
	   4, 5, 6, 6, 7, 4,  // back face
	   5, 6, 0, 0, 1, 5   // left face
	];
	
	for (var i = 8; i< vertices.length; i++){
		indices.push(i);
	}
	
	
	for (var i = 0; i < pips.length; i++){
		pips[i][3] = vertices.length;
		makeCube(pips[i][0], pips[i][1],pips[i][2], .3);
	
	}
	
	for (var i = 0; i < pips2.length; i++){
		pips2[i][3] = vertices.length;
		makeCube(pips2[i][0], pips2[i][1],pips2[i][2], .3);
		
	}
	
};

function makeCube(xCor,yCor,zCor, radi){
	
	var start = vertices.length;
	
	vertices.push(vec4(xCor-radi, yCor , zCor+radi,1));
	vertices.push(vec4(xCor-radi,yCor + .35, zCor + radi,1));
	vertices.push(vec4(xCor + radi, yCor + .35, zCor + radi, 1));
	vertices.push(vec4(xCor + radi, yCor, zCor + radi, 1.0));
	vertices.push(vec4(xCor - radi, yCor, zCor-radi, 1.0));
	vertices.push(vec4(xCor - radi, yCor + .35, zCor - radi, 1.0));
	vertices.push(vec4(xCor + radi, yCor + .35, zCor - radi, 1.0));
	vertices.push(vec4(xCor + radi, yCor, zCor - radi, 1.0));
	 
	
	for (var i = 0; i < 36; i++){
		indices.push(start + indices[i]);
	}

};
