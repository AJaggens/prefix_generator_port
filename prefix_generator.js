//input args
const docBody = document.getElementById('outputBody')
const postUrl = 'https://oneapi.infobip.com/1/networks/resolve/'

let countryCode = prompt("insert fixed numbers")
let sampleNumber = prompt("insert number sample with fixed numbers")

// generate num list start and end
let listStart = countryCode * (10 ** (sampleNumber.toString().length - countryCode.toString().length))
let listFinish = +(countryCode.toString() + (10 ** (sampleNumber.toString().length - countryCode.toString().length) - 1))

fetchInfo(listFinish)


//fetching fn
async function fetchInfo(num) {
   console.log(postUrl + num, 'started')
   const response = await fetch( postUrl + num, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
      })
   const json = await response.json()
   appendRespBody(json)
   if (num > listStart) {
      num = num - 100000
      fetchInfo(num)
   } else {
      console.alert("Finished")
      return}
}

//append sequence
function appendRespBody(responseBody) {
   let outputPara = document.createElement('p')
   outputPara.textContent = responseBody
      if (('requestError'in responseBody) == true ) {
         outputPara.textContent = `${responseBody.requestError.serviceException.text}`
      } else {
         if (responseBody.mcc == null && responseBody.mnc == null) {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | ${responseBody.network.name} ${responseBody.country.code} | NNC undefined`
         } else {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | ${responseBody.network.name} ${responseBody.country.code} | NNC ${responseBody.mcc} ${responseBody.mnc}`
            }
      docBody.appendChild(outputPara)
      }
}

