// Variáveis globais úteis
const boardRegions = document.querySelectorAll("#gameBoard span");

const player1Score = document.getElementById('player1Score')
const player2Score = document.getElementById('player2Score')
const inputPlayer1 = document.getElementById('player1')
const inputPlayer2 = document.getElementById('player2')

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");

const header = document.getElementById('header')
const main = document.querySelector('main')

let turnPlayer = "";
let vBoard = [];

function updateTitle() {
  const playerInput = document.getElementById(turnPlayer);
  document.getElementById("turnPlayer").innerText = playerInput.value.toUpperCase();
}

function initializeGame() {

  //Condicionais para adicionar nome caso o player não tenha colocado nada no input
  if(inputPlayer1.value.trim() === ""){
    inputPlayer1.value = "X"
  }
  if(inputPlayer2.value.trim() === ""){
    inputPlayer2.value = "O"
  }

  main.style.opacity = "1"

  // Inicializa as variáveis globais
  vBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  turnPlayer = "player1";
  // Ajusta a vez da cada player
  document.querySelector("h2").innerHTML = 'Vez de: <span id="turnPlayer"></span>';
  updateTitle();
  // Limpa o tabuleiro (caso seja necessário) e adiciona os eventos de clique
  boardRegions.forEach(function (element) {
    element.classList.remove("win");
    element.innerText = "";
    element.classList.add("cursor-pointer");
    element.addEventListener("click", handleBoardClick);
  })

  //Mostrar o nome do player no placar
  player1Score.innerText = inputPlayer1.value.toUpperCase();
  player2Score.innerText = inputPlayer2.value.toUpperCase()
}
// Verifica se existem três regiões iguais em sequência e devolve as regiões
function getWinRegions() {
  const winRegions = [];
  if (vBoard[0][0] && vBoard[0][0] === vBoard[0][1] && vBoard[0][0] === vBoard[0][2]) winRegions.push("0.0", "0.1", "0.2");
  if (vBoard[1][0] && vBoard[1][0] === vBoard[1][1] && vBoard[1][0] === vBoard[1][2]) winRegions.push("1.0", "1.1", "1.2");
  if (vBoard[2][0] && vBoard[2][0] === vBoard[2][1] && vBoard[2][0] === vBoard[2][2]) winRegions.push("2.0", "2.1", "2.2");
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][0] && vBoard[0][0] === vBoard[2][0]) winRegions.push("0.0", "1.0", "2.0");
  if (vBoard[0][1] && vBoard[0][1] === vBoard[1][1] && vBoard[0][1] === vBoard[2][1]) winRegions.push("0.1", "1.1", "2.1");
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][2] && vBoard[0][2] === vBoard[2][2]) winRegions.push("0.2", "1.2", "2.2");
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2]) winRegions.push("0.0", "1.1", "2.2");
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0]) winRegions.push("0.2", "1.1", "2.0");
  return winRegions;
}
// Desabilita uma região do tabuleiro para que não seja mais clicável
function disableRegion(element) {
  element.classList.remove("cursor-pointer");
  element.removeEventListener("click", handleBoardClick);
}
// Pinta as regiões onde o jogador venceu e mostra seu nome na tela
function handleWin(regions) {
  regions.forEach(function (region) {
    document.querySelector('[data-region="' + region + '"]').classList.add("win");
    document.getElementById("vezDe").classList.add("vezDeWin");
    document.getElementById("borderScreen").classList.add("borderWin");

  });
  const playerName = document.getElementById(turnPlayer).value;
  document.querySelector("h2").innerHTML = playerName.toUpperCase() + " VENCEU!";

  const btnContinuar = document.getElementById('btnContinuar')
  btnContinuar.style.opacity = "1"


  //Aumenta o valor no placar
  if (playerName === inputPlayer1.value) {
    let scoreXValue = parseInt(scoreXElement.textContent);
    scoreXValue++;
    scoreXElement.textContent = scoreXValue.toString().padStart(2, '0');

  } else if (playerName === inputPlayer2.value) {
    let scoreOValue = parseInt(scoreOElement.textContent);
    scoreOValue++;
    scoreOElement.textContent = scoreOValue.toString().padStart(2, '0');
  }
}

function handleBoardClick(ev) {

  const gameEnded = document.querySelector("h2").innerText.includes("VENCEU") || document.querySelector("h2").innerText.includes("EMPATE");

  if (gameEnded) {
    return;
  }
  // Obtém os índices da região clicada
  const span = ev.currentTarget;
  const region = span.dataset.region; // N.N
  const rowColumnPair = region.split("."); // ["N", "N"]
  const row = rowColumnPair[0];
  const column = rowColumnPair[1];
  // Marca a região clicada com o símbolo do jogador
  if (turnPlayer === "player1") {
    span.innerText = "X";
    vBoard[row][column] = "X";
  } else {
    span.innerText = "O";
    vBoard[row][column] = "O";
  }
  // Desabilita a região clicada
  disableRegion(span);
  // Verifica se alguém venceu
  const winRegions = getWinRegions();
  if (winRegions.length > 0) {
    handleWin(winRegions);
  } else if (vBoard.flat().includes("")) {
    turnPlayer = turnPlayer === "player1" ? "player2" : "player1";
    updateTitle();
  } else {
    document.querySelector("h2").innerHTML = "EMPATE!";
    btnContinuar.style.opacity = "1"
  }
  //Reseta o board para a nova jogada
  function resetBoard() {
    vBoard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    boardRegions.forEach(function (element) {
      element.classList.remove("win");
      element.innerText = "";
      element.classList.add("cursor-pointer");
      element.addEventListener("click", handleBoardClick);
    });
    document.querySelector("h2").innerHTML = 'Vez de: <span id="turnPlayer"></span>';
    updateTitle();
    document.getElementById("vezDe").classList.remove("vezDeWin");
    document.getElementById("borderScreen").classList.remove("borderWin");
  }

  btnContinuar.addEventListener("click", () => {
    btnContinuar.style.opacity = "0"
    resetBoard()
  })
}

// Adiciona o evento no botão que inicia o jogo
document.getElementById("start").addEventListener("click", initializeGame);
