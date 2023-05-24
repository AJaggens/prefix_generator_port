//page reconstruction
const secondStoredBody = document.querySelectorAll('.version-two');
document.getElementById('select-three').addEventListener('click', e => {
   console.log(secondStoredBody);
   document.body.querySelectorAll('.version-two').forEach( el => {
      console.log(el)
      document.body.removeChild(el);}
   );
});


//input args
const docBody = document.getElementById('output-body');
const postUrl = 'https://oneapi.infobip.com/1/networks/resolve/';
const generateButton = document.getElementById('generate-list');
const checkListButton = document.getElementById('list-check');
const checkListInsert = document.getElementById('list-insert');
let stepValue = '';

//imports
import networksJson from './libs/mno_networks.json' assert {type: 'json'};
import infBillingJson from './libs/inf_billing_0323.json' assert {type: 'json'};


checkListButton.addEventListener('click', e => {
   console.log(e)
   let subArray = document.getElementById('sub-list').value.split('\n');
   subArray.forEach(async sub => {
      const response = await fetch( postUrl + sub, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'}
         })
      const json = await response.json()
      appendListBody(json);
   });
})

checkListInsert.addEventListener('click', e => {
   console.log(e)
   let subArray = document.getElementById('sub-list').value.split('\n');
   subArray.forEach(async sub => {
      const response = await fetch( postUrl + sub, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'}
         })
      const json = await response.json()
      console.log(json)
      attachId(json, networksJson, infBillingJson);
      appendInsertBody(json);
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
   const json = await response.json();
   attachId(json, networksJson, infBillingJson);
   appendRespBody(json);
   if (varFin > start) {
      varFin = varFin - stepValue
      fetchInfo(varFin, start)
   } else {
      let finSpan = document.createElement('span')
      finSpan.textContent = 'Finished'
      document.getElementById('control-group').appendChild(finSpan)
      return}
}

function appendInsertBody(responseBody) {
   let outputPara = document.createElement('p')
   outputPara.textContent = responseBody
      if (('requestError' in responseBody) == true ) {
         outputPara.textContent = `${responseBody.requestError.serviceException.text}`
      } else {
            outputPara.textContent = `insert into mno_prefixes (id_mno,code) values (${responseBody.id_mno},${responseBody.country.prefix}${responseBody.networkPrefix});`
            }
      if (outputPara.isEqualNode(docBody.firstChild)){
         console.log('repeat')
      } else {
         docBody.insertBefore(outputPara, docBody.firstChild)
      }
}

//append list body
function appendListBody(responseBody) {
   let outputPara = document.createElement('p')
   outputPara.textContent = responseBody
      if (('requestError' in responseBody) == true ) {
         outputPara.textContent = `${responseBody.requestError.serviceException.text}`
      } else {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | localID ${responseBody.id_mno} | localname ${responseBody.localNetName} ${responseBody.country.name} | ${responseBody.network.name} | ${responseBody.country.code} | NNC ${responseBody.mcc} ${responseBody.mnc}`
            }
      if (outputPara.isEqualNode(docBody.firstChild)){
         console.log('repeat')
      } else {
         docBody.insertBefore(outputPara, docBody.firstChild)
      }
}

//append sequence
function appendRespBody(responseBody) {
   let outputPara = document.createElement('p')
   outputPara.textContent = responseBody
      if (('requestError' in responseBody) == true ) {
         outputPara.textContent = `${responseBody.requestError.serviceException.text}`
      } else {
         if (responseBody.mcc == null && responseBody.mnc == null) {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} / ${responseBody.network.name} / ${responseBody.country.code} / NNC undefined`
         } else {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} / ${responseBody.network.name} / ${responseBody.country.code} / NNC ${responseBody.mcc} ${responseBody.mnc}`
            }
      if (outputPara.isEqualNode(docBody.firstChild)){
         console.log('repeat')
      } else {
         docBody.insertBefore(outputPara, docBody.firstChild)
      }
}
}

//attach net id
function attachId(obj, networksJson, infBillingJson) {
   switch (obj) {
      case (obj.country.name == undefined): {
         console.log(`error`);
         break;
      }
      default: {
         let index = infBillingJson.findIndex(el => obj.country.name == el.country && obj.network.name == el.network);
         obj.mcc = infBillingJson[index].mcc;
         obj.mnc = infBillingJson[index].mnc;
         index = networksJson.findIndex(el => el.MCC == obj.mcc && el.MNC == obj.mnc);
         obj.id_mno = networksJson[index].id_mno;
         obj.localNetName = networksJson[index].network;
         return obj;
      }
   }
   
}
