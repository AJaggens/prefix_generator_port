//input args
const docBody = document.getElementById('outputBody')
let numbers = []


//generate num list
let countryCode = prompt('enter cc')
let numLength = prompt('enter length')

let startList = Number(countryCode * (10 ** (numLength - countryCode.length)))
let finishList = Number(countryCode + ((10 ** (numLength - countryCode.length)) - 1))

generateNumArray()


//generate num list
function generateNumArray () {
   for (let i = startList; i <= finishList; i = i + 100000000) {
      let postUrl = `https://oneapi.infobip.com/1/networks/resolve/${i}`
      fetchInfo(postUrl)
   }  
}

//fetch sequence
// function fetchInfo (postUrl) {
//    fetch(postUrl, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'}
//       })
   
//       .then(response => response.json())

//       .then(json => {
//          let outputPara = document.createElement('p')
//          if (('requestError'in json) == true ) {
//             outputPara.textContent = `${json.requestError.serviceException.text}`
//          } else {
//             if (json.mcc == null && json.mnc == null) {
//                outputPara.textContent = `prefix ${json.country.prefix}${json.networkPrefix} | ${json.network.name} ${json.country.code} | NNC undefined`
//             } else {
//                outputPara.textContent = `prefix ${json.country.prefix}${json.networkPrefix} | ${json.network.name} ${json.country.code} | NNC ${json.mcc} ${json.mnc}`
//             }
//          }
         
//          docBody.appendChild(outputPara)
//       })
// }

function fetchInfo (postUrl) {
   fetch(postUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
      })

   .then(response => response.json())

   .then(json => )
}