

const form2=$("#detailsForm");

const checkUrlParams=()=>{
  let {search,hash,href} = window.location;
  if(!search)
    search=hash;
  const urlParams = new URLSearchParams(search);
  if(urlParams.get('seed')==="true"){
    $.getJSON("../staticPages/seed")
    .done(data=>{
      console.log("data",data);
      storage.clear();//clear the storage in order to set the seed value
      for (let key in data) {
        storage.setItem(key,data[key]) 
      }
      let firs,last,title=storage.getItem("title");
      if(title==="Mr" || title==="Mis"){
        first="prevFirstName",
        last="prevLastName"
      }
      else if(title==="Corporate"){
        first="corporateName",
        last="corporateStructure"
      }
      else{
        first="associationName",
        last="corporateStructure"
      }
      storage.setItem(first,storage.getItem("firstName"))
      storage.setItem(last,storage.getItem("lastName"))
      window.location.href=href.replace("seed=true","")//remove the seed parameterfrom the url in order to not seeding on the next times
      isSeeded=true;
      setLocalStorageSomeItems();
      setTheFieldsWithLocalStorage();
      updateFullNameOnCard();//full name on credit card
      updateCustomFieldOnCard(customField.value);//custom field on credit card
    })
    .fail(( jqXHR,textStatus, errorThrown)=>{
      console.log("jqXHR",jqXHR.responseText);
      console.log("textStatus",textStatus);
      console.log("errorThrown",errorThrown)
    })
  }
  let prevSponsershipDiscount=storage.getItem("sponsershipDiscount");//if there is prev sponser ship, remove it.
  if(prevSponsershipDiscount){
    prevSponsershipDiscount=JSON.parse(prevSponsershipDiscount);
    if(prevSponsershipDiscount.isPerCard){
      //remove the sponsership discount from the card price
      storage.setItem("cardPrice",+storage.getItem("cardPrice")+prevSponsershipDiscount.discount);
      
    } 
    storage.removeItem("sponsershipDiscount")
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
        const status =obj.status.split(" ");
        const length = status.length;
        let endDate;
        if(obj.status.toLowerCase().includes("valid"))
        endDate=new Date(Date.parse(`${status[length-1]} ${status[length-2]} ${status[length-3]}`));//get the expiered date
        if(obj.status.toLowerCase().includes("expired") || endDate && endDate<new Date()){
          counter.addClass("display-none");//remove count-down if exsist
          paragraph.text("This offer has expired but you can buy an AMEX card");
          smallText.text("this offer has expired");
        }
        else if(obj.status.toLowerCase().includes("valid")){
          const displayPartOfCountdown=(partOfDate,str)=>{//return a part of the count down element
            return `<span class="d-flex flex-column mx-2 "> <span class="countdownDate text-warning border border-warning font-weight-bold ">${partOfDate}</span><span>${str} </span></span>`
          }
          
          counter.removeClass("display-none").countdown(endDate, function(event) {
            $(this).html(event.strftime(''
              +displayPartOfCountdown('%D','Days')
              +displayPartOfCountdown('%H','Hours')
              +displayPartOfCountdown('%M','Minuts')
              ));
          });
          smallText.text("this offer expire in");
          paragraph.html(`<span class='font-weight-bold'>Ezekiel Balouka</span> invite you to discover an 
          <span class='font-weight-bold'>Amex Mastercard</span><br/>
          Comlete this oreder and you will receive ${obj.reward.split("Reward of ")[1]}`);
                   
          updateSponsershipReward(obj.reward)//call the function that treats the discount
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



const updateNumCardOnDetailsSummary=(cardsNum)=>{//update cards number on the letter
    cardsNum>1? $(detailsSummary).find("img:nth-of-type(2)")
    .removeClass("display-none"):$(detailsSummary)
    .find("img:nth-of-type(2)").addClass("display-none");
    $(detailsSummary).find(".one").attr("data-content",cardsNum);
}
const addCardFirstDepodit=()=>{//add first deposit2 if needed
    let firstDeposit2=form2.find(".firstDeposit2");
    let isOneCard= storage.getItem("isOneCard")=== 'true';
     if(!isOneCard ){//add only if not isOneCard
        const firstDeposit2Sum=storage.getItem("firstDeposit2")
        if(firstDeposit2.length===0)//if there isn't first deposit 2 on card yet
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
          document.detailsForm.firstDeposit2.value=firstDeposit2Sum
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
    storage.removeItem("firstDeposit2")
  }

  
const updateCardPrice=({discount,isPerCard})=>{//when update a new discount
  if(isPerCard)
  {
      let cardPrice=+storage.getItem("cardPrice")
      cardPrice-=discount;
      storage.setItem("cardPrice",cardPrice);
      sum-=(discount*currentCardsNum())
  }
}
const updateSponsershipReward=(reward)=>{//update the sponsership discount details on local storage
  const sponsershipDiscount={
      discount:Number(reward.split(" ")[0]),
      isPerCard:reward.includes("per card")
  }
  storage.setItem("sponsershipDiscount",JSON.stringify(sponsershipDiscount));
  updateCardPrice(sponsershipDiscount);
}

const selectStyle=()=>{//make and refresh the select style
  $("select").addClass("selectpicker").selectpicker('refresh');
  $(".bootstrap-select").addClass("col-12 pl-0");
  $(".organization .bootstrap-select").removeClass("pl-0");
}
 
const loadAndHashChangeHandler =()=>{//onload the window or change the url
  const hash=window.location.hash;
  setTimeout(e=>{//without settimeout the function will be executed before chackurlparameters fun and that couses that the sponsership discount doesnt succeed to load before the summary order
    if(hash.includes("page3"))
  {
    //when I want to go to page3 I have to insure that first and second form is completed
    if(!isOneFormCompleted("personalDetailsForm")){//if first form isn't completed go to page1 
      window.location.href="#page1";
    }
    else if(!isOneFormCompleted("detailsForm")){//if second form isn't completed go to page2
      window.location.href="#page2";
    }
    else if(!isForm1submited){//if forms had completed I have to submit the forms in order to refresh data on staticPages
      //if it hadn't refreshed yet
      $(form1).trigger("submit");
      $(form2).trigger("submit");
    }
  }
  else if(hash.includes("page2"))
  {
    if(!isOneFormCompleted("personalDetailsForm")){
      window.location.href="#page1";
    }
    else if(!isForm1submited){
      $(form1).trigger("submit");
    }
  }
  },0)
  
  
  }
  window.onhashchange=loadAndHashChangeHandler;
  window.onload=loadAndHashChangeHandler;