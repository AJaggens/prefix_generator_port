//input args
const docBody = document.getElementById('outputBody')
const postUrl = 'https://oneapi.infobip.com/1/networks/resolve/'
const generateButton = document.getElementById('generate-list')

generateButton.addEventListener('click', e => {
   console.log(e)
   let countryCode = document.getElementById('country-code').value
   let sampleNumber = document.getElementById('sample-number').value
   console.log(countryCode)
   console.log(sampleNumber)
   // generate num list start and end
   let listStart = countryCode * (10 ** (sampleNumber.toString().length - countryCode.toString().length))
   let listFinish = +(countryCode.toString() + (10 ** (sampleNumber.toString().length - countryCode.toString().length) - 1))
   fetchInfo(listFinish,listStart)
})


//fetching fn
async function fetchInfo(varFin, start) {
   console.log(postUrl + varFin, 'started')
   const response = await fetch( postUrl + varFin, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
      })
   const json = await response.json()
   appendRespBody(json)
   if (varFin > start) {
      varFin = varFin - 100000
      fetchInfo(varFin, start)
   } else {
      let finSpan = document.createElement('span')
      finSpan.textContent = 'Finished'
      document.getElementById('control-group').appendChild(finSpan)
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

