//input args
const docBody = document.getElementById('output-body');
const postUrl = 'https://oneapi.infobip.com/1/networks/resolve/';
const generateButton = document.getElementById('generate-list');
const checkListButton = document.getElementById('list-check');
const checkListInsert = document.getElementById('list-insert');
let stepValue = '';

//imports
import networksJson from './libs/mno_networks.json' with { type: "json" };
import infBillingJson from './libs/inf_billing_0323.json' with { type: "json" };

//checklist button click event
checkListButton.addEventListener('click', e => {
   console.log(e)
   let subArray = document.getElementById('sub-list').value.split('\n');
   subArray.forEach(async sub => {
      const response = await fetch( postUrl + sub, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'}
         })
      const json = await response.json()
      if (json.valid == true) {
         attachId(json, networksJson, infBillingJson);
         appendListBody(json);   
      } else {
         console.error(json.requestError.serviceException.text)
      }      
   });
})

//checklist and convert to sqlinserts button click event
checkListInsert.addEventListener('click', e => {
   console.log(e)
   let subArray = document.getElementById('sub-list').value.split('\n');
   subArray.forEach(async sub => {
      const response = await fetch( postUrl + sub, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'}
         })
      const json = await response.json()
      if (json.requestError == undefined) {
         attachId(json, networksJson, infBillingJson);
         appendInsertBody(json);
      } else {
         console.log('error')
      }      
   });
})

//start generating subs based on cc and codelength button click event
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
   if (json.requestError) {
      console.log(json.requestError.serviceException.text)
   } else {
      attachId(json, networksJson, infBillingJson);
      appendListBody(json);
   };

   if (varFin > start) {
      varFin = varFin - stepValue
      fetchInfo(varFin, start)
   } else {
      let finSpan = document.createElement('span')
      finSpan.textContent = 'Finished'
      document.getElementById('control-group').appendChild(finSpan)
      return}
}

//append sql inserts instead of json data
function appendInsertBody(responseBody) {
   let outputPara = document.createElement('p')
   outputPara.textContent = responseBody
   if (responseBody.id_mno == 'NULL' || responseBody.localNetName == 'NULL') {
      outputPara.textContent = `Local_ID or LocalName is NULL`
   } else {
      outputPara.textContent = `insert into mno_prefixes (id_mno,code) values (${responseBody.id_mno},${responseBody.country.prefix}${responseBody.networkPrefix});`
      }
   filterResp(outputPara)
}

//append list body
function appendListBody(responseBody) {
   let outputPara = document.createElement('p')
   outputPara.textContent = responseBody
      if (('requestError' in responseBody) == true ) {
         outputPara.textContent = `${responseBody.requestError.serviceException.text}`
      } else {
            outputPara.textContent = `prefix ${responseBody.country.prefix}${responseBody.networkPrefix} | Local_ID is ${responseBody.id_mno} | LocalName is ${responseBody.localNetName} ${responseBody.country.name} | ${responseBody.network.name} | ${responseBody.country.code} | NNC ${responseBody.mcc} ${responseBody.mnc}`
            }
   filterResp(outputPara)
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
   console.log(obj)
   let index = infBillingJson.findIndex(el => obj.country.name == el.country && obj.network.name == el.network);
   if (index == -1 && obj.network.mnc == '') {
      obj.id_mno = 'NULL'
      obj.localNetName = 'Landline'
      obj.mnc = '00'
      obj.mcc = obj.network.mcc
   } else if (index == -1 && obj.network.mnc != '') {
      obj.id_mno = 'NULL'
      obj.localNetName = 'NULL'
      obj.mnc = 'NULL'
      obj.mcc = 'NULL'
      console.log('Network not found and not landline, skipping')
   } else {
      obj.mcc = infBillingJson[index].mcc;
      obj.mnc = infBillingJson[index].mnc;
      index = networksJson.findIndex(el => el.MCC == obj.mcc && el.MNC == obj.mnc);
      console.log(networksJson[index])
      if (networksJson[index] == undefined) {
         obj.id_mno = 'NULL'
      } else {
         obj.id_mno = networksJson[index].id_mno;
      }
      if (networksJson[index] == undefined) {
         obj.localNetName = 'NULL'
      } else {
         obj.localNetName = networksJson[index].network;
      }
      return obj;
      }
   
}

//filter and append resp depending on current output nodelist
function filterResp(resp) {
   if (docBody.hasChildNodes()) {
      if (Array.from(docBody.childNodes).find(node => node.isEqualNode(resp))){
         console.log('skipping')
      } else {
         docBody.insertBefore(resp, docBody.firstChild)
      }
   } else {
      docBody.appendChild(resp)
   }
}
