let board = [];
let solution = [];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++)
    if (grid[row][x] == num || grid[x][col] == num)
      return false;

  let startRow = row - row % 3;
  let startCol = col - col % 3;

  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (grid[r+startRow][c+startCol] == num)
        return false;

  return true;
}

function solve(grid) {
  for (let row=0; row<9; row++) {
    for (let col=0; col<9; col++) {
      if (grid[row][col] == 0) {
        for (let num of shuffle([1,2,3,4,5,6,7,8,9])) {
          if (isSafe(grid,row,col,num)) {
            grid[row][col] = num;
            if (solve(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateSudoku() {
  let grid = Array.from({length:9}, () => Array(9).fill(0));
  solve(grid);

  solution = grid.map(r => [...r]);

  // remove números (dificuldade)
  for (let i=0; i<45; i++) {
    let r = Math.floor(Math.random()*9);
    let c = Math.floor(Math.random()*9);
    grid[r][c] = "";
  }

  board = grid;
}

function createBoard() {
  const el = document.getElementById("sudoku");  
  el.innerHTML = "";

  board.forEach((row,r)=>{
    row.forEach((val,c)=>{
      const input = document.createElement("input");
      input.className = "cell";

      if(val !== "") {
        input.value = val;
        input.disabled = true;
      }

	  input.addEventListener("focus", () => highlight(r, c));
      input.addEventListener("input", checkWin);
      el.appendChild(input);
    });
  });
}

function highlight(row, col) {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, i) => {
    const r = Math.floor(i / 9);
    const c = i % 9;

    cell.style.background = "";

    if (r === row || c === col) {
      cell.style.background = "var(--highlight)";
    }
  });
}

function checkWin() {
  const cells = document.querySelectorAll(".cell");
  let i=0;

  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      if(cells[i].value != solution[r][c]) return;
      i++;
    }
  }

  if(navigator.vibrate) navigator.vibrate(300);
  alert("Você venceu!");
}

function newGame(){
  generateSudoku();
  createBoard();
}


/* ranking */
function loadRanking(){
  let ranking = JSON.parse(localStorage.getItem("ranking"))||[];
  let list = document.getElementById("rankingList");
  list.innerHTML="";
  ranking.forEach(r=>{
    let li=document.createElement("li");
    li.textContent=`${r.name} - ${r.time}s`;
    list.appendChild(li);
  });
}

function openModal(id){
  document.getElementById(id).style.display="block";
  loadRanking();
}

function closeModal(id){
  document.getElementById(id).style.display="none";
}

generateSudoku();
createBoard();