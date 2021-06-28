



//all veribles

const wholeData={};
const card2= document.getElementsByClassName('card2')[0];
const detailsSummary=document.getElementsByClassName("detailsSummary")[0];
const addCard= document.getElementById('addCard');
const deleteCard= document.getElementById('deleteCard');
let isOneCard=$(card2).hasClass("display-none");
const form1=$("#personalDetailsForm");
const fieldsOfForm=form1.find(">div>span");
const Ibun=$(".ibunSapn");
let firstName="",lastName="",corporateName="",corporateStructure="",associationName="";
const titleValues=[$(document.personalDetailsForm.title).val()];
const validator=$.validator;
const inputs=document.personalDetailsForm.elements
const customField=document.personalDetailsForm.customField[0];
const fullName=[inputs[4],inputs[5]];
const detailsOnCard=$(".pict>div:first-child>div");
const fullNameOnCard=detailsOnCard.find("div:nth-child(2)");
const customFieldOnCard=detailsOnCard.find("div:nth-child(3)")


//all function definition

const selectStyle=()=>{
  $("select").addClass("selectpicker").selectpicker('refresh');
  $(".bootstrap-select").addClass("col-12 pl-0");
}

const checkUrlParams=()=>{
  let {search,hash} = window.location;
  if(!search)
    search=hash;
  const urlParams = new URLSearchParams(search);
  if(urlParams.get('seed')==="true"){
    $.getJSON("../staticPages/seed")
    .done(data=>{
      console.log("data",data)
      const {title}=data;
      document.personalDetailsForm.title.value=title;
      delete data.title;
      Object.keys(data).forEach((key)=>{
        $(document.personalDetailsForm[key]).val(data[key]);
        $(document.detailsForm[key]).val(data[key]); 
      })
      updateFullNameOnCard();
      updateCustomFieldOnCard(customField.value);
      titleChanges(title);
    })
    .fail(( jqXHR,textStatus, errorThrown)=>{
      console.log("jqXHR",jqXHR.responseText);
      console.log("textStatus",textStatus);
      console.log("errorThrown",errorThrown)
    })
  }
  const sponsership=urlParams.get('sponsership')
  if(sponsership){
  
    $.getJSON("../staticPages/sponsership")
    .done( (data)=>{
      console.log("data",data)
      data.forEach((obj)=>{
      if(obj.parameterValue===sponsership){
        const sponsershipModal=$("#sponershipModal");
        const paragraph=sponsershipModal.find('div.h6');
        const smallText=sponsershipModal.find('small');
        const counter=sponsershipModal.find('#countdown');
        if(obj.status.toLowerCase().includes("expired")){
          counter.addClass("display-none");
          paragraph.text("This offer has expired but you can buy an AMEX card");
          smallText.text("this offer has expired");
        }
        else if(obj.status.toLowerCase().includes("valid")){
          const displayPartOfCountdown=(partOfDate,str)=>{
            return `<span class="d-flex flex-column mx-2 "> <span class="countdownDate text-warning border border-warning font-weight-bold ">${partOfDate}</span><span>${str} </span></span>`
          }
          const status =obj.status.split(" ");
          const length = status.length
          const endDate=new Date(Date.parse(`${status[length-1]} ${status[length-2]} ${status[length-3]}`));
          counter.removeClass("display-none").countdown(endDate, function(event) {
            $(this).html(event.strftime(''
              +displayPartOfCountdown('%d','Days')
              +displayPartOfCountdown('%H','Hours')
              +displayPartOfCountdown('%M','Minuts')
              ));
          });
          smallText.text("this offer expire in");
          paragraph.html(`<span class='font-weight-bold'>Ezekiel Balouka</span> invite you to discover an 
          <span class='font-weight-bold'>Amex Mastercard</span><br/>
          Comlete this oreder and you will receive ${obj.reward.split("Reward of ")[1]}`);          
          wholeData.reward=obj.reward;
        }
          sponsershipModal.modal({
            show:true
          })
          return;
        }   
      })
    })
    .fail(( jqXHR,textStatus, errorThrown)=>{
      console.log("jqXHR",jqXHR.responseText);
      console.log("textStatus",textStatus);
      console.log("errorThrown",errorThrown)
    })
  }
}//end checkUrlParams

const changeIbun=(e)=>{
  $(e.target).parents(".ibunSapn").find("span").text(`IBUN ${e.target.value.toUpperCase()}`)
}
const changeFieldsName=(firstName,lastName,nameDate)=>{//function to change the labels when change the title
   $(fieldsOfForm[0]).find("label:first-of-type").text(firstName);
   $(fieldsOfForm[0]).find("input").text(firstName);
   $(fieldsOfForm[1]).find("label:first-of-type").text(lastName);
   form1.find("[for=dateOfBirth]:first-of-type").text(nameDate);
}
const changeNameOfFirstField=(name)=>{//change the name of first field when change the title
   $(fieldsOfForm[0]).find("label:first-of-type").text(camelCaseToSentence(name)).attr("for",name);
      $(fieldsOfForm[0]).find("input").attr("name",name);
}
const titleChanges=(titleValue)=>{
  //const titleValue=e.target.value;
  const add=$(".organization");
  const card=$(".card1");
  const card2=$(".card2");
  const formTitle=form1.find(".formTitle");
  const prevVal=titleValues[titleValues.length-1];
  titleValues.push(titleValue)
  //save the prev value
  if(prevVal==="Corporate"){

    corporateName=$(document.personalDetailsForm.firstName).val();
    corporateStructure=$(document.personalDetailsForm.lastName).val();
  }
  else if(prevVal==="Association"){
    associationName=$(document.personalDetailsForm.associationName).val();
  }
  else{
    firstName=$(document.personalDetailsForm.firstName).val();
    lastName=$(document.personalDetailsForm.lastName).val();
  }
  if(titleValue==="Corporate" || titleValue==="Association"){
    updateCustomFieldOnCard("");
    formTitle.text(`${titleValue.toUpperCase()} INFORMATION`)
    if(titleValue==="Association")
    {
      changeFieldsName("Company Name","Corporate Structure","Date of birth person in charge");
      $(fieldsOfForm[1]).addClass("display-none");
      changeNameOfFirstField("associationName");
      $(document.personalDetailsForm.associationName).val(associationName);
      updateFullNameOnCard(fullName[0].value,"");      
    }
    else{
      changeNameOfFirstField("firstName");
      $(fieldsOfForm[1]).removeClass("display-none");
      changeFieldsName("Company Name","Corporate Structure","Date of birth person in charge")
      $(document.personalDetailsForm.firstName).val(corporateName);
      $(document.personalDetailsForm.lastName).val(corporateStructure);
      updateFullNameOnCard();
    }
    const customizeDiv=add.find(".customizeConfirm");
    const customizeInput=customizeDiv.find("#Customize");
    add.removeClass("display-none");
    let cardClone=card.clone();
    card.addClass("display-none");
    card2.addClass("display-none");
    cardClone.addClass("mt-3");
    cardClone.find("[for=customField]").text("Indicate here the desired customization").css("font-size",".84em")
    let cards=add.find(".cards");
    function cardToAdd(name){//return clone of one card
      let a=cardClone.clone(true);
      a.removeClass("display-none").removeClass("card1");
      a.attr("name",`card${name}`)
      a.find(">span:first-of-type input").attr("name",`customField${name}`)
      a.find(">span:nth-of-type(2) input").attr("name",`ibun${name}`).on("change",changeIbun);
      return a;
    }
    const cardsChange=(e)=>{//when change the number of selected cards
      cards.empty();
      for(i=0; i<Number(e.target.value);i++)
      {
        cards.append(cardToAdd(i+1))
      }
      updateNumCardOnDetailsSummary(Number(e.target.value));
    }
    if(cards.length===0){//if this is the first tyme to change to corporate or association
    
        cardClone.find("#addCard").remove();
        customizeDiv.after(`<div class='cards ${customizeInput[0].checked===false?'display-none':''}'></div>`);
        cards=add.find(".cards");
        cards.append(cardToAdd(1))
        let options="";
        let option=""
        for(i=0;i<6; i++){
          options+=`<option  value=${i+1} >${i+1} cards </option>`
        }
        const sel=add.find(" select");
        sel.append(options).on("change",cardsChange);
        selectStyle();
    }
    updateNumCardOnDetailsSummary(Number(add.find(" select").val()));
    customizeInput.on("change",(e)=>{//when change the checkbox of Customize & IBAN selection
      const cards=add.find(".cards");
      cards.toggleClass("display-none")
    })
  }
  else{//if Mr or Mis
    updateNumCardOnDetailsSummary(isOneCard?1:2);
    formTitle.text("PERSONAL DETAILS")
    add.addClass("display-none");
    card.removeClass("display-none");
    if(!isOneCard)
    card2.removeClass("display-none");
    changeNameOfFirstField("firstName");
    changeFieldsName("First Name","Last Name","Date of birth")
    $(fieldsOfForm[1]).removeClass("display-none");
    $(document.personalDetailsForm.firstName).val(firstName);
    $(document.personalDetailsForm.lastName).val(lastName);
    updateCustomFieldOnCard(customField.value);
    updateFullNameOnCard();
  }

}//end of change title

function updateFullNameOnCard(fname=fullName[0].value,lname=fullName[1].value){
  fullNameOnCard.text(`${fname} ${lname}`)
};
function updateCustomFieldOnCard(custom){
  customFieldOnCard.text(custom)
};

const updateDateOnCard=()=>{
  const date=new Date();
 detailsOnCard.find("div:first-child").text(`${date.getMonth()<9?'0':""}${date.getMonth()+1}/${(date.getFullYear()+2)%100}`)
}
//events

form1.find("input[name=title]").on("change",e=>{
  titleChanges(e.target.value)
 })


Ibun.find("input").on("change",changeIbun);

addCard.onclick=()=>{
    card2.classList.remove("display-none");
    addCard.classList.add("display-none");
   updateNumCardOnDetailsSummary(2)
    addCardFirstDepodit();
    isOneCard=false;
 }
 
 deleteCard.onclick=()=>{
    card2.classList.add("display-none");
    addCard.classList.remove("display-none");
    updateNumCardOnDetailsSummary(1)
    removeCardFirstDepodit();
    isOneCard=true;
 }

 $(fullName).on("change",e=>{
  if(titleValues[titleValues.length-1]==="Association")
  updateFullNameOnCard(fullName[0].value,"");
  else
  updateFullNameOnCard()
})

$(customField).on("change",e=>{updateCustomFieldOnCard(customField.value)})


//use functions  


selectStyle();
checkUrlParams();
updateDateOnCard();
updateFullNameOnCard();  
updateCustomFieldOnCard(customField.value);

//valid the first form

const globalValidate=(form)=>{
  return {
    errorClass: "invalid",
    highlight: function(element, errorClass, validClass) {
    $(element).addClass(errorClass).removeClass(validClass);
      $(`${form} [for=${element.id}]`)
        .addClass(errorClass+"Label");
      if(element.name==="confirm")
      $(".labelConfirm>span:first-child").addClass("invalidLabel");

    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).removeClass(errorClass).addClass(validClass);
      $(`${form} [for=${element.id}]`)
        .removeClass(errorClass+"Label");
        if(element.name==="confirm")
      $(".labelConfirm>span:first-child").removeClass("invalidLabel");

    }
  }
}

const vaildDateFromString=(str)=>{
  const [d,m,y]=str.split("/");
  return new Date(y,Number(m-1),d);
}

validator.addMethod("isAdult",(value,element,params) => {
   return  vaildDateFromString(value)<= new Date().setFullYear(new Date().getFullYear()-18)
},"Must be at least 18 years old.");

validator.addMethod("validDate",(value,element,params) => {
   return  /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(value) && vaildDateFromString(value)<new Date()
},"Please enter a valid date.");

validator.addMethod("fullNameLength",(value,element)=>{
  return fullName[0].value.length+fullName[1].value.length<26
},"Full name length is longer than 26 characters.");


const camelCaseToSentence =str=>{
  return str.replace( /([A-Z]|[0-9])/g, " $1" ).toLowerCase();
}

validator.addMethod("deliveryMaxLength",(value,element,param)=>{
  return value.length<param
},
(param,element)=>{
  const name=camelCaseToSentence(element.name)
 return `The ${name} may not be greater than ${param} characters.`
})

$("#personalDetailsForm").validate({
 ...globalValidate("#personalDetailsForm"),
   rules: {
      firstName: {
        required: true,
        
      },
      lastName: {
        required: true,
        fullNameLength:true
       
      },
      companyName: {
         required: true
        
       },
       corporateStructure: {
         required: true
        
       },
      associationName: {
         required: true,
         maxlength:20
        
       },
       dateOfBirth: {
         required: true,
         validDate:true,
         isAdult:true
        
       },
       confirm:{
          required:true,
         
       }
    },
    messages: {
   
    },
})

//submit 

form1.submit(e=>{
  e.preventDefault();
  const isValid= form1.valid();
  if(isValid){
   
     location.href ="#page2";
     const data= new FormData(form1[0]);
     data.forEach((value,key,parent)=>{
       wholeData[key]=value;
     })
     if(wholeData.title==="Corporate" || wholeData.title==="Association"){
       removeCardFirstDepodit();
     }
     else
      addCardFirstDepodit();
    console.log(wholeData);
  }
  return false;
})

