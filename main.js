import "./sass/main.scss";

const rowsInput = document.getElementById("rows-input");
const columnsInput = document.getElementById("columns-input");

rowsInput.addEventListener("change", (event) => {
	rowsInput.setAttribute("value", event.target.value);
	rows = parseInt(event.target.value);
});
columnsInput.addEventListener("change", (event) => {
	columnsInput.setAttribute("value", event.target.value);
	cols = parseInt(event.target.value);
});

let rows = rowsInput.getAttribute("value");
let cols = columnsInput.getAttribute("value");

let started = false;
let timer;
let evolutionSpeed = 300;

let currGen = [rows];
let nextGen = [rows];

//buttons & listeners
const createButton = document.getElementById("create-button");

createButton.addEventListener("click", () => {
	document.getElementById("world").innerHTML = ``;
	createWorld();
	createGenArrays();
	initGenArrays();
	console.log("Game board ready!");
});
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
	let startstop = document.querySelector("#start-button");

	if (!started) {
		started = true;
		startstop.innerHTML = "Stop";
		console.log("Let's play!");
		evolve();
	} else {
		started = false;
		startstop.innerHTML = "Start";
		console.log("Game stopped!");
		clearTimeout(timer);
	}
});

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", () => {
	location.reload();
	console.log("Reload...");
});

const randomButton = document.querySelector("#random-button");
randomButton.addEventListener("click", () => {
	createWorld();
	createGenArrays(); // current and next generations
	initGenArrays();
	document.getElementById("world").innerHTML = ``;
	random();
	console.log("Random cells are alive.");
});

// Create arrays to hold cells attributes
function createGenArrays() {
	for (let i = 0; i < rows; i++) {
		currGen[i] = new Array(cols);
		nextGen[i] = new Array(cols);
	}
}

function initGenArrays() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			currGen[i][j] = 0;
			nextGen[i][j] = 0;
		}
	}
}

//create game board
function createWorld() {
	let world = document.querySelector("#world");

	let tbl = document.createElement("table");
	tbl.setAttribute("id", "worldgrid");
	tbl.setAttribute("class", "world__table");
	for (let i = 0; i < rows; i++) {
		let tr = document.createElement("tr");
		for (let j = 0; j < cols; j++) {
			let cell = document.createElement("td");
			cell.setAttribute("id", i + "_" + j);
			cell.setAttribute("class", "dead");
			cell.addEventListener("click", cellClick);

			tr.appendChild(cell);
		}
		tbl.appendChild(tr);
	}
	world.appendChild(tbl);
}

//change alive/dead status by click on cell
function cellClick() {
	let loc = this.id.split("_");
	let row = Number(loc[0]); //Get i
	let col = Number(loc[1]); //Get j
	// Toggle cell alive or dead
	if (this.className === "alive") {
		this.setAttribute("class", "dead");
		console.log(`Cell ${this.id} is dead now.`);
		currGen[row][col] = 0;
	} else {
		this.setAttribute("class", "alive");
		currGen[row][col] = 1;
		console.log(`Cell ${this.id} is alive now.`);
	}
}

//counting dead/alive neighbors
function getNeighborCount(row, col) {
	let count = 0;
	let nrow = Number(row);
	let ncol = Number(col);
	if (nrow - 1 >= 0) {
		if (currGen[nrow - 1][ncol] == 1) count++;
	}
	if (nrow - 1 >= 0 && ncol - 1 >= 0) {
		if (currGen[nrow - 1][ncol - 1] == 1) count++;
	}
	if (nrow - 1 >= 0 && ncol + 1 < cols) {
		if (currGen[nrow - 1][ncol + 1] == 1) count++;
	}
	if (ncol - 1 >= 0) {
		if (currGen[nrow][ncol - 1] == 1) count++;
	}
	if (ncol + 1 < cols) {
		if (currGen[nrow][ncol + 1] == 1) count++;
	}
	if (nrow + 1 < rows && ncol - 1 >= 0) {
		if (currGen[nrow + 1][ncol - 1] == 1) count++;
	}
	if (nrow + 1 < rows && ncol + 1 < cols) {
		if (currGen[nrow + 1][ncol + 1] == 1) count++;
	}
	if (nrow + 1 < rows) {
		if (currGen[nrow + 1][ncol] == 1) count++;
	}
	return count;
}

// create next generation of alive cells
function createNextGen(row, col) {
	for (row in currGen) {
		for (col in currGen[row]) {
			let neighbors = getNeighborCount(row, col);
			if (currGen[row][col] == 1) {
				if (neighbors < 2) {
					nextGen[row][col] = 0;
				} else if (neighbors == 2 || neighbors == 3) {
					nextGen[row][col] = 1;
				} else if (neighbors > 3) {
					nextGen[row][col] = 0;
				}
			} else if (currGen[row][col] == 0) {
				if (neighbors == 3) {
					nextGen[row][col] = 1;
				}
			}
		}
	}
}

//update current generation with data from next generation, and clean next generation data
function updateCurrGen(row, col) {
	for (row in currGen) {
		for (col in currGen[row]) {
			currGen[row][col] = nextGen[row][col];
			nextGen[row][col] = 0;
		}
	}
}

//refresh of game board
function updateWorld(row, col) {
	let cell = "";
	for (row in currGen) {
		for (col in currGen[row]) {
			cell = document.getElementById(row + "_" + col);
			if (currGen[row][col] == 0) {
				cell.setAttribute("class", "dead");
			} else {
				cell.setAttribute("class", "alive");
			}
		}
	}
}

// put everything together, let's play!
function evolve() {
	createNextGen(); //Apply the rules
	updateCurrGen(); //Set Current values from new generation
	updateWorld(); //Update the world view
	if (started) {
		timer = setTimeout(evolve, evolutionSpeed);
	}
}

// put random alive cells on a game board, for lazy people
function random() {
	let world = document.querySelector("#world");

	let tbl = document.createElement("table");
	tbl.setAttribute("id", "worldgrid");
	for (let i = 0; i < rows; i++) {
		let tr = document.createElement("tr");
		for (let j = 0; j < cols; j++) {
			let cell = document.createElement("td");
			if (Math.random() > 0.5) {
				cell.setAttribute("id", i + "_" + j);
				cell.setAttribute("class", "alive");
				cell.addEventListener("click", cellClick);
			} else {
				cell.setAttribute("id", i + "_" + j);
				cell.setAttribute("class", "dead");
				cell.addEventListener("click", cellClick);
			}
			tr.appendChild(cell);
			let loc = cell.id.split("_");
			let row = Number(loc[0]); //Get i
			let col = Number(loc[1]); //Get j
			// Toggle cell alive or dead
			if (cell.className === "alive") {
				cell.setAttribute("class", "alive");
				currGen[row][col] = 1;
			} else {
				cell.setAttribute("class", "dead");
				currGen[row][col] = 0;
			}
		}
		tbl.appendChild(tr);
	}
	world.appendChild(tbl);
}
