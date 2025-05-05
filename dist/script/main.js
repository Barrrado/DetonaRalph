const state = {
	view: {
		square: document.querySelectorAll('.square'),
		enemy: document.querySelector('.enemy'),
		time: document.querySelector('.time'),
		score: document.querySelector('.score'),
		playgame: document.querySelector('.iniciar'),
		Parar: document.querySelector('.Pausar'),
		ResetJogo: document.querySelector('.reset'),
		gameOverModal: document.getElementById('gameOverModal'),
		finalScoreElement: document.getElementById('finalScore'),
		closeButton: document.querySelector('.close-button'),
		restartButton: document.querySelector('.resetar'),
		countdown: document.getElementById('countdown'),
		lives: document.querySelector('.lives'),
		finallive: document.querySelector('.finallive')
	},
	values: {
		timerId: null,
		gameVelocity: 1500,
		hitPosition: 0,
		result: 0,
		currentTime: 120,
		enemyIntervalId: null,
		live: 100,
		previousRandomNumber: null
	}
}
// Aminação do iminigo
const enemybox = () => {
	state.view.square.forEach((square) => {
		square.classList.remove('enemy')
	})
	let randomNumber
	// Garante que o novo número seja diferente do anterior
	do {
		randomNumber = Math.floor(Math.random() * 9)
	} while (randomNumber === state.values.previousRandomNumber)
	state.values.previousRandomNumber = randomNumber // Atualiza a posição anterior
	let randomSquare = state.view.square[randomNumber]
	randomSquare.classList.add('enemy')
	state.values.hitPosition = randomSquare.id
}
//HIT BOX DO JOGO
const hitbox = () => {
	state.view.square.forEach((square) => {
		square.addEventListener('mousedown', () => {
			if (square.id === state.values.hitPosition) {
				state.values.result++
				state.view.score.textContent = state.values.result
				state.values.hitPosition = null
				playSound('hit')
				AumentaVelo()
			} else {
				playSound('errou')
				state.values.live--
				state.view.lives.textContent = state.values.live
			}
		})
	})
}

//Movimento do personagem
const iniciarMoveEnemy = () => {
	if (state.values.currentTime > 0) {
		state.values.enemyIntervalId = setInterval(
			enemybox,
			state.values.gameVelocity
		)
	}
}
function iniciarAumentoComContagem(novaVelocidade) {
	let contador = 5
	const countdownElement = state.view.countdown
	const levelUpSound = new Audio('./audios/fudeu.m4a') // Certifique-se de ter este arquivo de áudio
	levelUpSound.volume = 0.2

	// Exibe a contagem inicial
	countdownElement.textContent = 'Acelerando em: ' + contador
	levelUpSound.play() // Inicia a reprodução do som

	const intervaloContagem = setInterval(() => {
		contador--
		countdownElement.textContent = 'Acelerando em: ' + contador
		levelUpSound.play() // Reproduz o som a cada segundo

		if (contador <= 0) {
			clearInterval(intervaloContagem)
			countdownElement.textContent = '' // Limpa a contagem regressiva da tela
			levelUpSound.pause() // Pausa a reprodução do som
			levelUpSound.currentTime = 0 // Reinicia a reprodução para a próxima vez
			state.values.gameVelocity = novaVelocidade
			if (state.values.enemyIntervalId) {
				clearInterval(state.values.enemyIntervalId)
				iniciarMoveEnemy() // Reinicia o movimento com a nova velocidade
			}
		}
	}, 1000) // Atualiza a cada 1 segundo
}

// aumento da dificuldade conforme o numero de pontos
function AumentaVelo() {
	if (state.values.result === 15) {
		state.values.gameVelocity = 1000
		if (state.values.enemyIntervalId) {
			clearInterval(state.values.enemyIntervalId)
			iniciarMoveEnemy() // Reinicia o movimento com a nova velocidade
		}
	}
	if (state.values.result === 50) {
		state.values.gameVelocity = 500
		if (state.values.enemyIntervalId) {
			clearInterval(state.values.enemyIntervalId)
			iniciarAumentoComContagem(state.values.gameVelocity)
			iniciarMoveEnemy() // Reinicia o movimento com a nova velocidade
		}
	}
}
// Pausar o jogo
const pararMoveEnemy = () => {
	clearInterval(state.values.enemyIntervalId)
}

//TIMER
let intervalId
function timerJogo() {
	state.values.currentTime--
	state.view.time.textContent = state.values.currentTime
	if (state.values.currentTime === 0) {
		clearInterval(intervalId) // Para o timer quando chega a zero
		pararMoveEnemy()
		state.view.finalScoreElement.textContent = state.values.result
		state.view.finallive.textContent = state.values.live
		state.view.gameOverModal.style.display = 'block'
	}
}
// Função para reiniciar o jogo
function reiniciarJogo() {
	state.values.currentTime = 60
	state.values.result = 0
	state.view.time.textContent = state.values.currentTime
	state.view.score.textContent = state.values.result
	state.values.gameVelocity = 1500 // Reseta a velocidade inicial
	state.values.hitPosition = null
	state.values.previousRandomNumber = null
	clearInterval(state.values.enemyIntervalId)
	state.values.enemyIntervalId = null
	state.view.gameOverModal.style.display = 'none' // Oculta o modal
	iniciarTimer() // Reinicia o timer e o jogo
}

function iniciarTimer() {
	if (!intervalId) {
		intervalId = setInterval(timerJogo, 1000) // Inicia o timer a cada 1 segundo
		iniciarMoveEnemy()
	}
}
function pausarTimer() {
	clearInterval(intervalId)
	intervalId = null // Limpa o ID para indicar que o timer está pausado
	pararMoveEnemy()
}
//Audio
function playSound(audioName) {
	let audio = new Audio(`./audios/${audioName}.m4a`)
	audio.volume = 0.2
	audio.play()
}
// Inicia o jogo
function iniciar() {
	iniciarTimer()
	hitbox()
}
//funcões para botões para iniciar e pausar o jogo!!
state.view.playgame.addEventListener('click', () => {
	iniciar()
})
state.view.Parar.addEventListener('click', () => {
	pausarTimer()
})

state.view.restartButton.addEventListener('click', () => {
	location.reload()
})
