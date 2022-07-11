//input args
const docBody = document.getElementById('outputBody')
const postUrl = 'https://jsonplaceholder.typicode.com/posts'

for (let i = 1; i <= 100; i++ ) {
   Url = `${postUrl}/${i}`
   console.log(fetchInfo(Url))
}


async function fetchInfo(postUrl) {
   console.log(postUrl, 'started')
   const response = await fetch(postUrl, {
      //method: 'POST',
      //headers: {'Content-Type': 'application/json'}
      })
   const json = await response.json()
   return json
}



//generate num list
// function generateNumList () {
//    for (let i = startList; i <= finishList; i = i + 10000000) {
//       let postUrl = `https://oneapi.infobip.com/1/networks/resolve/${i}`
//       fetchInfo(postUrl)
//    }  
// }


// // fetch sequence
// function fetchInfo (postUrl) {
//    fetch(postUrl, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'}
//       })
   
//       .then(response => response.json())

//       .then(json => {const responseBody = json
//          appendRespBody(responseBody)
//       })

// }

// //append sequence
// function appendRespBody(responseBody) {
//    let outputPara = document.createElement('p')
//       if (('requestError'in responseBody) == true ) {
//          outputPara.textContent = `${responseBody.requestError.serviceException.text}`
//       } else {
//          if (responseBody.mcc == null && responseBody.mnc == null) {
//             outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | ${responseBody.network.name} ${responseBody.country.code} | NNC undefined`
//          } else {
//             outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | ${responseBody.network.name} ${responseBody.country.code} | NNC ${responseBody.mcc} ${responseBody.mnc}`
//             }
//       docBody.appendChild(outputPara)
//       }
// }

