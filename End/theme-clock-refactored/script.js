//courtesy of Victoria Garcia off Udemy

const hoursElement   = document.querySelector('.hour')
const minutesElement = document.querySelector('.minute')
const secondsElement = document.querySelector('.second')

const timeElement   = document.querySelector('.time')
const dateElement   = document.querySelector('.date')

const toggle        = document.querySelector('.toggle')

const days   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 *  Toggle Light-Dark modes 
 */
toggle.addEventListener('click', (e) => {

    const body = document.querySelector('body')
    body.classList.toggle('dark')

    if(body.classList.contains('dark')) {
        e.target.innerText = 'Light mode'
    } else {
        e.target.innerText = 'Dark mode'
    }
})

/**
 * Clock
 */
function digitalClock(time) {

    timeElement.innerText = `${time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`

    dateElement.innerHTML = `${days[time.getDay()]}, <span  class="day">${time.getDate()}</span> ${months[time.getMonth()]} `
}

function analogClock(time) {
    
    const hours = time.getHours() % 12
    const hourNeedleRotation = scale(hours, 0, 11, 0, 360)
    const minuteNeedleRotation = scale(time.getMinutes(), 0, 59, 0, 360)
    const secondNeedleRotation = scale(time.getSeconds(), 0, 59, 0, 360)

    hoursElement.style.transform = `translate(-50%, -100%) rotate(${hourNeedleRotation}deg)`
    minutesElement.style.transform = `translate(-50%, -100%) rotate(${minuteNeedleRotation}deg)`
    secondsElement.style.transform = `translate(-50%, -100%) rotate(${secondNeedleRotation}deg)`
}

function setTime() {
    const time = new Date();

    analogClock(time)
    digitalClock(time)
}

function scale(num, in_min, in_max, out_min, out_max) {
    return ((num - in_min) * (out_max - out_min) / (in_max -in_min) + out_min)
}

setTime()

setInterval(setTime, 1000)