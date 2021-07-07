
//veribles

const modal=$("#myModal");
const form2=$("#detailsForm");
let emailValue="";

//functions
const addCardFirstDepodit=()=>{//addfirst deposit2 if needed
  let firstDeposit2=form2.find(".firstDeposit2");
   if(!isOneCard ){
     if(firstDeposit2.length===0)
     {
   const firstDeposit= `<span class='col-12 firstDeposit2'>
   <label >
       Card #2 First Deposit
   </label > 
       <select name=firstDeposit2>
           <option value="0">​0 Eur</option>
           <option value="10">10 Eur</option>
           <option value="20">20 Eur</option>
       </select>
        
</span>`
  form2.find(".firstDeposit1").after(firstDeposit);
   selectStyle();
  }
  else{
    firstDeposit2.removeClass("display-none")
  }
   }
   else if(isOneCard){
     firstDeposit2.addClass("display-none")
   }
}

const removeCardFirstDepodit=()=>{//remove first deposit 2
  form2.find(".firstDeposit2").addClass("display-none");
  delete wholeData.firstDeposit2;
}

const changeModalRadios=(selector,value,text)=>{//email suggestion radios buttons
    const label=modal.find(selector);
    label.find("input").val(value);
    const children= label.children();
    label.text(text).prepend(children);
    children.change((e)=>{
        emailValue=e.target.value;
    })
 }

//events

$(document.detailsForm.email).focusout((e)=>{
  if(e.target.value && !$(e.target).hasClass("invalid")){  
    const emailSuggestion={ 
      "@gnail.con":"@gmail.com",
      "@gnail.com":"@gmail.com",
      "@gmaill.com":"@gmail.com",
      '@fmail.com':"@gmail.com",
      "@hotnail.com":"@hotmail.com",
      "@hotmaill.com":"@hotmail.com",
      "@hotmail.con":"@hotmail.com"
    }
    const extension=e.target.value.split('@')[1];//the email domain
    const index=Object.keys(emailSuggestion).indexOf(`@${extension}`)//if user email domain exsist in the Suggestion and where 
    if(index>-1)  
    {  
        const correctExtension=Object.values(emailSuggestion)[index];
        const correct=e.target.value.replace(`@${extension}`,correctExtension)
        changeModalRadios(".correct",correct,correct);
        changeModalRadios(".wrong",e.target.value,`keep (${e.target.value})`);
        modal.find(".wrong input").prop("checked",true);
        emailValue=e.target.value
        modal.modal({
            show:true
        })
    }
  }
})
 
modal.find(".ok").click((e)=>{
    $(document.detailsForm.email).val(emailValue);
})

//validate form2
 
const valid=$("#detailsForm").validate({
    ...globalValidate("#detailsForm"),
      rules: {
        email: {
           required: true,
           email:true
         },
         phoneNumber: {
           required: true,
           minlength:2,
           maxlength:11
          
         },
         address: {
            required: true,
            maxlength:30
           
          },
          additionalAddress: {
            maxlength:30
           
          },
          city: {
            required: true,
            maxlength:25
           
          },
          zipCode: {
            required: true,
            maxlength:15
           
          },
          deliveryAddress1: {
            required: true,
            deliveryMaxLength:30
          },
          deliveryAddress2:{
            deliveryMaxLength:30,
            
          },
          deliveryCity:{
            required:true,
            deliveryMaxLength:25,
          },
          deliveryZipCode:{
            required:true,
            deliveryMaxLength:15,
          },
          answer:{
            required:true,
            minlength:5,
            maxlength:22
          },
          confirm:{
            required:true,
        }
       },
       messages: {
      
       },
   })

//submit

form2.submit(e=>{
  e.preventDefault();
  const isValid= form2.valid();
   if(isValid){
      location.href ="#page3";
      const data= new FormData(form2[0]);
      data.forEach((value,key,parent)=>{//update in whole data
          wholeData[key]=value;
      })
      console.log(wholeData);
      updateDatailsOnLetter();
      updateSummeryCard();//update thecardson summary
   }
  return false;
})