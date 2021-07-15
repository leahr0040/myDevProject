const storage=window.localStorage;
let isForm1submited=false;

const setLocalStorageSomeItems=()=>{//set the items that arenwt fields on the forms
    let isFormsCompletedObject=JSON.parse(storage.getItem("isFormsCompletedObject"));//isFormsCompletedObject
    if(!isFormsCompletedObject){
      isFormsCompletedObject={
        personalDetailsForm:false,
        detailsForm:false
      };
      storage.setItem("isFormsCompletedObject",JSON.stringify(isFormsCompletedObject))
    }
    let isOneCard=storage.getItem("isOneCard");//isOneCard
    if(isOneCard===null){
      storage.setItem("isOneCard",true)
    }
    let cardPrice=storage.getItem("cardPrice");//cardPrice
    if(!cardPrice){
      storage.setItem("cardPrice",29.9)
    }
    storage.setItem("iban",document.personalDetailsForm.iban.value)//first card iban
    let associationName=storage.getItem("associationName");
    let corporateName=storage.getItem("corporateName"),
    corporateStructure=storage.getItem("corporateStructure"),
    prevFirstName=storage.getItem("prevFirstName"),
    prevLastName=storage.getItem("prevLastName");
    if(!associationName)
    storage.setItem("associationName","");
    if(!corporateName){
      storage.setItem("corporateName","");
      storage.setItem("corporateStructure","")
    }
    if(!prevFirstName){
      storage.setItem("prevFirstName","");
      storage.setItem("prevLastName","")
    }
  }  
  
  const setOneFormToCompleted=(formName)=>{//functions to sign that a form is completed
    let isFormsCompletedObject=JSON.parse(storage.getItem("isFormsCompletedObject"));
    if(isFormsCompletedObject){
      isFormsCompletedObject[formName]=true;
      storage.setItem("isFormsCompletedObject",JSON.stringify(isFormsCompletedObject));
    }
  }
  const setOneFormToNotCompleted=(formName)=>{//functions to sign that a form isn't completed or changed without submition
    let isFormsCompletedObject=JSON.parse(storage.getItem("isFormsCompletedObject"));
    if(isFormsCompletedObject){
      isFormsCompletedObject[formName]=false;
      storage.setItem("isFormsCompletedObject",JSON.stringify(isFormsCompletedObject));
    }
  }
  const isOneFormCompleted=(formName)=>{//return if a form completed
    let isFormsCompletedObject=JSON.parse(storage.getItem("isFormsCompletedObject"));
    if(isFormsCompletedObject){
      return isFormsCompletedObject[formName];
    }
    return false;
  }
  const setTheFieldsWithLocalStorage=()=>{//set all the fields of the forms with the local storage items
    let key;
    let value;
    for (let index=0;index<storage.length ;index++) {
      key=storage.key(index);
      value=storage.getItem(key);
      //set the right form (first or second)
      let keyElement=document.personalDetailsForm[key];
      if(!keyElement){
        keyElement=document.detailsForm[key];
      }
      if($(keyElement).attr("type")==="radio"){
        keyElement.value=value;
      }
     else if($(keyElement).attr("type")==="checkbox"){
       keyElement.checked=value==='true'
     }
      else{
         $(keyElement).val(value);
      }  
    }
    $(".ibanSapn").each((i,elem)=>{
      $(elem).find("span")
      .text(`IBAN ${document.personalDetailsForm[$(elem).find("input").attr("name")].value.toUpperCase()}`)
    })
    titleChanges(storage.getItem("title"));
    selectStyle();
  }
const isFielsFormNameIs=(formName,element)=>{//return if the elements form name is the given name
    return Object.values(element.parents()).some(elem=>$(elem).attr("name")===formName)
}
const setLocalStorageValue=(element)=>{//set a value on the storage
    let value=element.value;
        if($(element).attr("type")=="checkbox")
            value=element.checked
        storage.setItem($(element).attr("name"),value);
}
const setLocalStorageWithInitialFieldsValue=()=>{
   Object.values(document.personalDetailsForm.elements).forEach(element=>{
        setLocalStorageValue(element);
    });
    Object.values(document.detailsForm.elements).forEach(element=>{
        setLocalStorageValue(element);
    })
}
const setLocalOnFieldsChange=()=>{//when a field in the forms is changed
  $('input,select,textarea').on("change textInput input",e=>{
  const element=e.target;
  setLocalStorageValue(element);
   //set the form to not completed
  if(isFielsFormNameIs("detailsForm",$(element)))//if this is the second form set only the second form
    setOneFormToNotCompleted("detailsForm");
  else if(isFielsFormNameIs("personalDetailsForm",$(element))){
      //if this is the first form set both the first and the second form
    setOneFormToNotCompleted("personalDetailsForm");
    setOneFormToNotCompleted("detailsForm");
  }
})
}