// Variáveis globais úteis
const boardRegions = document.querySelectorAll("#gameBoard span");
const gameBoard = document.getElementById('gameBoard')
const scoreBoard = document.getElementById('scoreBoard')
const borderScreen = document.getElementById('borderScreen')

const player1Score = document.getElementById('player1Score')
const player2Score = document.getElementById('player2Score')
const inputPlayer1 = document.getElementById('player1')
const inputPlayer2 = document.getElementById('player2')

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const vsScore = document.getElementById('vs')
const btnContinuar = document.getElementById('btnContinuar')

const header = document.querySelector('header')
const main = document.querySelector('main')

let turnPlayer = "";
let vBoard = [];

function updateTitle() {
  const playerInput = document.getElementById(turnPlayer);
  document.getElementById("turnPlayer").innerText = playerInput.value.toUpperCase();
}

function initializeGame() {

  document.getElementById('rules').style.display = 'none'

  header.style.display = "none"

  //Condicionais para adicionar nome caso o player não tenha colocado nada no input
  if(inputPlayer1.value.trim() === ""){
    inputPlayer1.value = "Jogador X"
  }
  if(inputPlayer2.value.trim() === ""){
    inputPlayer2.value = "Jogador O"
  }

  main.style.display = "flex"

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

  checkGameEnd()

  // const btnContinuar = document.getElementById('btnContinuar')
  btnContinuar.style.opacity = "1"
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

function checkGameEnd() {

  
  const scoreXValue = parseInt(scoreXElement.textContent);
  const scoreOValue = parseInt(scoreOElement.textContent);
  
  let playerWin = null;

  if (scoreXValue >= 3) {
    playerWin = `${inputPlayer1.value.toUpperCase()}`;
  } else if (scoreOValue >= 3) {
    playerWin = `${inputPlayer2.value.toUpperCase()}`;
  }
  if (playerWin) {
    
    alert(`Fim do jogo...`)
    gameBoard.style.display = "none"; // Esconde o tabuleiro
    player1Score.style.display = "none";
    player2Score.style.display = "none";
    inputPlayer1.style.display = "none";
    inputPlayer2.style.display = "none";
    scoreXElement.style.display = "none";
    scoreOElement.style.display = "none";
    btnContinuar.style.display = "none"
    document.getElementById("vezDe").style.display = 'none'

    scoreBoard.style.height = '80vh'
    borderScreen.style.height = '100%'
    borderScreen.classList.add('borderWinGameOver')
    // borderScreen.style.backgroundImage = "url(./img/gameOver.png)"
    // borderScreen.style.backgroundSize = 'cover'
    // borderScreen.style.backgroundRepeat = 'no-repeat'

    const winner = `${playerWin} VENCEU!`;
    const vsScore = document.getElementById('vs'); 
    
    vsScore.innerText = ''
    
    let index = 0;

    function escreverTexto() {
      let index = 0;
      function adicionarCaractere() {
          if (index < winner.length) {
              if (winner.charAt(index) === ' ') {
                  vsScore.innerText += '\u00A0';
              } else {
                  vsScore.innerText += winner.charAt(index);
              }
              index++;
              setTimeout(adicionarCaractere, 120);
          } else {
               // Quando a escrita estiver completa, reinicie o loop
               vsScore.innerText = ''; // Limpa o conteúdo do elemento para começar de novo
               index = 0;
              setTimeout(adicionarCaractere, 120); // Espera 1 segundo antes de iniciar o próximo loop
          }
      }
      adicionarCaractere();

      const restart = document.getElementById("reloadButton")
      restart.style.display = "flex"
      main.style.display = "flex"
      main.style.flexDirection = 'column'

      document.getElementById('containerScore').style.height = '100%'
  }
  escreverTexto();
    vsScore.style.padding = '0px 80px 300px'
    vsScore.style.fontSize = '20vh'
  }
  
}


// Adiciona o evento no botão que inicia o jogo
document.getElementById("start").addEventListener("click", initializeGame);

document.getElementById("reloadButton").addEventListener("click", function() {
  location.reload();
});