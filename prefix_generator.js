//input args
const docBody = document.getElementById('outputBody')
let numbers = []
let countryCode = prompt('CC')
let numLength = prompt('length')

let listStart = countryCode * Math.pow(10, numLength)
let listFinish = +(countryCode + (Math.pow(10, numLength) - 1))

generateNumbers(listStart,listFinish)
console.log(numbers)

//generate sub list from args
function generateNumbers (listStart,listFinish) {
   for (let i = listStart; i++; i <= listFinish) {
      numbers.push(i)
   }
}

//loop over sub list
function fetchLoop (numbers) {
   for (num of numbers) {
      const currSubNum = num
      const postUrl = `https://oneapi.infobip.com/1/networks/resolve/${currSubNum}`
      fetchInfo (postUrl)
   }
}

//fetch sequence
function fetchInfo (postUrl) {
   fetch(postUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
      })
   
      .then(response => response.json())
      .then(json => {
         let outputPara = document.createElement('p')
         console.log(json)
         if (json.mcc == null && json.mnc == null) {
            outputPara.textContent = `${json.networkPrefix} | ${json.network.name} ${json.country.code} | NNC undefined`
         } else {
            outputPara.textContent = `${json.networkPrefix} | ${json.network.name} ${json.country.code} | NNC ${json.mcc} ${json.mnc}`
         }
         docBody.appendChild(outputPara)
      })
}
