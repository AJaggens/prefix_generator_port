//input args
const docBody = document.getElementById('outputBody')

postInfo()

//generate sub list from args
function postInfo () {
   let number = prompt('Enter number')
   let postUrl = `https://oneapi.infobip.com/1/networks/resolve/${number}`
   fetchInfo (postUrl)
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
         if (('requestError'in json) == true ) {
            outputPara.textContent = `${json.requestError.serviceException.text}`
         } else {
            if (json.mcc == null && json.mnc == null) {
               outputPara.textContent = `prefix ${json.networkPrefix} | ${json.network.name} ${json.country.code} | NNC undefined`
            } else {
               outputPara.textContent = `${json.networkPrefix} | ${json.network.name} ${json.country.code} | NNC ${json.mcc} ${json.mnc}`
            }
         }
         
         docBody.appendChild(outputPara)
      })
}
