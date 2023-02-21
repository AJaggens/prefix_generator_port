//input args
const docBody = document.getElementById('output-body');
const postUrl = 'https://oneapi.infobip.com/1/networks/resolve/';
const generateButton = document.getElementById('generate-list');
const checkListButton = document.getElementById('list-check');
let stepValue = '';


checkListButton.addEventListener('click', e => {
   console.log(e)
   let subArray = document.getElementById('sub-list').value.split('\n');
   subArray.forEach(async sub => {
      const response = await fetch( postUrl + sub, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'}
         })
      const json = await response.json()
      filterResp(json,filteredArray)
   });
})

generateButton.addEventListener('click', e => {
   console.log(e)
   let countryCode = document.getElementById('country-code').value
   let sampleNumber = document.getElementById('sample-number').value
   stepValue = document.getElementById('step-value').value

   console.log(countryCode)
   console.log(sampleNumber)

   if (typeof +countryCode == 'number' && typeof +sampleNumber == 'number') {
      // generate num list start and end
   let listStart = countryCode * (10 ** (sampleNumber.toString().length - countryCode.toString().length))
   let listFinish = +(countryCode.toString() + (10 ** (sampleNumber.toString().length - countryCode.toString().length) - 1))
   fetchInfo(listFinish,listStart)
   } else {
      alert('CountryCode or sample are not numbers')
   }
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
      varFin = varFin - stepValue
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
      if (('requestError' in responseBody) == true ) {
         outputPara.textContent = `${responseBody.requestError.serviceException.text}`
      } else {
         if (responseBody.mcc == null && responseBody.mnc == null) {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | ${responseBody.network.name} | ${responseBody.country.code} | NNC undefined`
         } else {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | ${responseBody.network.name} | ${responseBody.country.code} | NNC ${responseBody.mcc} ${responseBody.mnc}`
            }
      if (outputPara.isEqualNode(docBody.firstChild)){
         console.log('repeat')
      } else {
         docBody.insertBefore(outputPara, docBody.firstChild)
      }
      }
}