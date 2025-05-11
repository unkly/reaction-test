class ReactionTest {
  constructor() {
    this.gameState = 'waiting'
    this.circleColor = 'none'
    this.showCircle = false
    this.circleAppearTime = 0
    this.results = []
    this.mistakes = 0
    this.successCount = 0

    // DOM要素
    this.gameArea = document.querySelector('.game-area')
    this.startButton = document.getElementById('startButton')
    this.circle = document.getElementById('circle')
    this.resultsDiv = document.getElementById('results')
    this.mistakeCount = document.getElementById('mistakeCount')
    this.reactionTimesList = document.getElementById('reactionTimesList')
    this.playAgainButton = document.getElementById('playAgainButton')

    // イベントリスナーの設定
    this.startButton.addEventListener('click', () => this.startGame())
    this.playAgainButton.addEventListener('click', () => this.startGame())
    this.gameArea.addEventListener('click', (e) => {
      if (e.target !== this.startButton && this.gameState === 'playing') {
        this.handleCircleClick()
      }
    })
  }

  startGame() {
    this.gameState = 'playing'
    this.results = []
    this.mistakes = 0
    this.successCount = 0
    this.startButton.style.display = 'none'
    this.resultsDiv.classList.add('hidden')
    this.scheduleNextCircle()
  }

  scheduleNextCircle() {
    this.showCircle = false
    this.circleColor = 'none'
    this.circle.style.display = 'none'
    this.circle.classList.remove('yellow', 'red')

    if (this.successCount >= 5) {
      this.finishGame()
      return
    }

    const delay = Math.random() * 3000 + 1000
    setTimeout(() => {
      const isYellow = Math.random() > 0.5
      this.circleColor = isYellow ? 'yellow' : 'red'
      this.circle.classList.add(this.circleColor)

      requestAnimationFrame(() => {
        this.circle.style.display = 'block'
        this.showCircle = true
        this.circleAppearTime = performance.now()

        if (this.circleColor === 'red') {
          setTimeout(() => {
            if (this.showCircle && this.circleColor === 'red') {
              this.scheduleNextCircle()
            }
          }, 2000)
        }
      })
    }, delay)
  }

  handleCircleClick() {
    if (!this.showCircle) return

    if (this.circleColor === 'yellow') {
      const reactionTime = (performance.now() - this.circleAppearTime) * 0.75
      this.results.push({ reactionTime: Math.round(reactionTime), timestamp: performance.now() })
      this.successCount++
      this.scheduleNextCircle()
    } else if (this.circleColor === 'red') {
      this.mistakes++
      this.scheduleNextCircle()
    }
  }

  finishGame() {
    this.gameState = 'finished'
    this.circle.style.display = 'none'
    this.resultsDiv.classList.remove('hidden')
    this.mistakeCount.textContent = `ミス回数: ${this.mistakes}回`

    this.reactionTimesList.innerHTML = this.results.map((result, index) => `<p>${index + 1}回目: ${result.reactionTime}ミリ秒</p>`).join('')
  }
}

// ゲームの初期化
document.addEventListener('DOMContentLoaded', () => {
  new ReactionTest()
})
