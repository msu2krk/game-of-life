import "./sass/main.scss";
// const body = document.body;
// const container = body.container;
// const controls = container.controls;
const rows = document.querySelector("#rows-input");
const cols = document.querySelector("#columns-input");

const testButton = document.getElementById("test-button");

testButton.addEventListener("click", () => {
	const test = "mission successful";
	console.log("test: ", test);
	console.log("rows: ", typeof rows, rows.value);
	console.log("cols: ", typeof cols, cols.value);
	document.getElementById("world").innerHTML = ``;
	createWorld();
});

function createWorld() {
	let world = document.querySelector("#world");

	let tbl = document.createElement("table");
	tbl.setAttribute("id", "worldgrid");
	for (let i = 0; i < rows.value; i++) {
		let tr = document.createElement("tr");
		for (let j = 0; j < cols.value; j++) {
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

function cellClick() {
	let loc = this.id.split("_");
	let row = Number(loc[0]); //Get i
	let col = Number(loc[1]); //Get j
	// Toggle cell alive or dead
	if (this.className === "alive") {
		this.setAttribute("class", "dead");
	} else {
		this.setAttribute("class", "alive");
	}
}
