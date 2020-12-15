const range = document.getElementById('range')

range.addEventListener('input', (e) => {
  const value = +e.target.value
  const label = e.target.nextElementSibling
  label.innerHTML = value 

  const rangeWidth = getComputedStyle(e.target).getPropertyValue('width') 
  const labelWidth = getComputedStyle(label).getPropertyValue('width') 

  const numRangeWidth = +rangeWidth.substring(0, rangeWidth.length - 2)
  const numLabelWidth = +labelWidth.substring(0, labelWidth.length - 2)

  const max = +e.target.max
  const min = +e.target.min
  const scaledOffset = scale(value, min, max, 10, -10)

  console.log(numRangeWidth, numLabelWidth, value, scaledOffset)
//can be done cleaner without scale, using translate property on css
  const left = (value / max ) * ( numRangeWidth ) - numLabelWidth/2 + scaledOffset
  console.log(left)
  label.style.left = `${left}px`
 
})

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// value, 0, 100, out_min=10 out_max = -10
// ( 50 - 0 * -10 - 10 ) / (100 - 0) + 10
// ( 50 * -20 ) / 100 + 10
// -1000 / 100 + 10 @ value = 50 scale = 0
// -1200 / 100 + 10 @ value = 60 scale = -2 
// -2000 / 100 + 10 @ value = 100 scale = -10
