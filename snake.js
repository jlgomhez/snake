const myCanvas = document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');
const gamezoneWidth = myCanvas.width;
const gamezoneHeight = myCanvas.height;


//tamaño de head
const SIZE = 20;
//posicion inicial de head
const head = {x: 0,	y: 0};
const body = [];
let food = null;
let score = 0;

let dx = 0;
let dy = 0;

let lastAxis;

//setInterval ejecuta una funcion, en este caso la funcion main, cada determinado tiempo, en este caso cada segundo
setInterval(main, 150); //1000 milisegundos entre cada dibujo

//la logica princial se encuentra en main
function main () {
	update(); //actualizar las variables del juego
	draw(); //dibujar todos los objetos del juego
}

//update solo crear o actualizar las variables que sirven como referencia para dibujar los objetos
function update () {
	
	//salvar posicion previa del ultimo elemento de la serpiente
	let prevX, prevY;
	if (body.length >= 1) {
		prevX = body[body.length-1].x;
		prevY = body[body.length-1].y;
	} else {
		prevX = head.x;
		prevY = head.y;
	}

	//actualizar las coordenadas del cuerpo de la serpiente (seguir la cabeza)
	for (let i=body.length-1; i>=1; --i) {//cada cuadrado del cuerpo sigue al que esta frente a el
		body[i].x = body[i-1].x;
		body[i].y = body[i-1].y; //elem 3 <-- elem 2, elem 2 <-- elem 1, elem1 <-- elem 0
	}
	if (body.length >= 1) { //ultimo cuadrado del cuerpo sigue a la cabeza
		//se pone en un if porque el cuerpo no existe al inicio
		body[0].x = head.x;
		body[0].y = head.y; 
	}
	
	//actualizar las coordenadas de la cabeza de la serpiente
	head.x += dx;
	head.y += dy;
	//determinar en que eje ha ocurrido el ultimo movimiento
	if (dx !== 0) {
		lastAxis = 'X';
	} else if (dy !== 0){
		lastAxis = 'Y';
	}

	//detectar si la serpiente ha consumido el alimento
	//solo si hay un alimento disponible se aplica la condicion
	if (food && head.x === food.x && head.y === food.y) {
		food = null;
		//aumentar el tamaño de la serpiente
		increaseSnakeSize (prevX, prevY);
		increaseScore();
	}

	//generar el alimento en caso que no exista
	if (!food) {
		food = randomFoodPosition();
	}

	const collisionCheck = checkSnakeCollision();
	if (collisionCheck){
		gameOver();
		return;
	}
}

function increaseScore () {
	score = score + 1;
	return;
}

function checkSnakeCollision () {
	//hay colision cuando las coordenadas de la cabeza son iguales a las coordenadas del cuerpo de la serpiente
	for (let i=0; i<body.length; i++) {
		if (head.x == body[i].x && head.y == body[i].y) {
			return true;
		}
	}

	//verificar que la serpiente no se salga de los limites
	const topCollision = (head.y < 0);
	const bottomCollision = (head.y > gamezoneHeight - SIZE);
	const leftCollision = (head.x < 0);
	const rightCollision = (head.x > gamezoneWidth - SIZE);
	if (topCollision || bottomCollision || leftCollision || rightCollision) {
		return true;
	}

	return false;
}

function gameOver() {
		alert(`Has perdido. Tu puntiación es de: ${score}`);
		head.x = 0;
		head.y = 0;
		dy = 0;
		dx = 0;
		body.length = 0;
		score = 0;
}

function increaseSnakeSize (prevX, prevY) {
	body.push(
		{x: prevX,
		 y: prevY}
		);
}

function randomFoodPosition () {
	//genera posiciones aleatorias hasta que no se genere en espacios ocupados
	let position;
	do {
		position = {x: getRandomX(), y: getRandomY()};
	} while (checkFoodCollision(position));
	return position;
}

function checkFoodCollision (position) {
	//comparar las coordenadas del alimento generado con el cuerpo de la serpiente
		for (let i=0; i<body.length; i++) {
		if (position.x == body[i].x && position.y == body[i].y) {
			return true;
		}
	}
	if (position.x == head.x && position.y == head.y) {
		return true;
	}
	return false;
}

function getRandomX() {
	//0, 20, 40, ..., 380
	//0, 1, 2, ...,19		x20
	return 20 * (parseInt(Math.random() * 20));
}

function getRandomY() {
	//0, 20, 40, ..., 440
	//0, 1, 2, ..., 22 x 20
	return 20 * (parseInt(Math.random() * 23));
}

//limpia el canvas y llama a la funcion drawObject para dibujar la serpiente y la comida
function draw () {
	//definir un fondo de color negro
	context.fillStyle = 'black';
	//limpia el contexto
	context.fillRect(0, 0, myCanvas.width, myCanvas.height);

	//dibuja la cabeza de la serpiente
	drawObject(head, 'lime');
	//dibujar el cuerpo de la serpiente
	body.forEach(
		elem => drawObject (elem, 'lime')
	);
	//dibujar el alimento
	drawObject(food, 'white'); 
}

//funcion para dibujar los objetos
function drawObject (obj, color) {
	context.fillStyle = color;
	context.fillRect(obj.x, obj.y, SIZE, SIZE);
}

document.addEventListener('keydown', moveSnake);

function moveSnake(event) {
	//las condiciones restringen los movimientos
	switch (event.key){
		case 'ArrowUp':
			if (lastAxis !== 'Y') {
				dx = 0;
				dy = -SIZE;
				console.log('Mover hacia arriba');
			}
			break;
		case 'ArrowDown':
			if (lastAxis !== 'Y') {
				dx = 0;
				dy = +SIZE;
				console.log('Mover hacia abajo');
			}
			break;
		case 'ArrowRight':
			if (lastAxis !== 'X') {
				dx = +SIZE;
				dy = 0;
				console.log('Mover hacia la derecha');
			}
			break;
		case 'ArrowLeft':
			if (lastAxis !== 'X') {
				dx = -SIZE;
				dy = 0;
				console.log('Mover hacia la izquierda');
			}
			break;
	}
}