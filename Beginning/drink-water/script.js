const smallCups = document.querySelectorAll('.cup-small')
const liters = document.getElementById('liters')
const percentage = document.getElementById('percentage')
const remaining = document.getElementById('remaining')

smallCups.forEach((cup, index) => {
  cup.addEventListener('click', () => highlightCups(index))
})

function highlightCups(index) {
  if(smallCups[index].classList.contains('full') && !smallCups[index].nextElementSibling.classList.contains('full')) {
    index--}

   
  smallCups.forEach((cup, index2) => {
    index2 <= index ? cup.classList.add('full') : cup.classList.remove('full')
  })

  updateBigCup()
}

function updateBigCup() {
  const fullCups = document.querySelectorAll('.cup-small.full').length
  const totalCups = smallCups.length
  const heightBigCup = 330
  const heightFilled = fullCups / totalCups * heightBigCup
  const percentageFilled = fullCups / totalCups * 100

  if(fullCups === 0) {
    percentage.style.visibility = 'hidden'
    percentage.style.height = 0
  } else {
    percentage.style.visibility = 'visible'
    percentage.style.height = `${heightFilled}px`
    percentage.innerText = `${percentageFilled}%`
  }

  if(fullCups === totalCups) {
    remaining.style.visibility = 'hidden'
    remaining.style.height = 0
  } else {
    remaining.style.visibility = 'visible'
    liters.innerText = `${2 - (percentageFilled * 2 / 100)}L`
  }
}