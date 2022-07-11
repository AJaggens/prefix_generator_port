//input args
const docBody = document.getElementById('outputBody')
let numbers = []


//generate num list
let countryCode = prompt('enter cc')
let numLength = prompt('enter length')

let startList = Number(countryCode * (10 ** (numLength - countryCode.length)))
let finishList = Number(countryCode + ((10 ** (numLength - countryCode.length)) - 1))

generateNumList()


//generate num list
function generateNumList () {
   for (let i = startList; i <= finishList; i = i + 10000000) {
      let postUrl = `https://oneapi.infobip.com/1/networks/resolve/${i}`
      fetchInfo(postUrl)
   }  
}


// fetch sequence
function fetchInfo (postUrl) {
   fetch(postUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
      })
   
      .then(response => response.json())

      .then(json => {const responseBody = json
         appendRespBody(responseBody)
      })

}

//append sequence
function appendRespBody(responseBody) {
   let outputPara = document.createElement('p')
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