
//veribles
let sum=0;
let totalDiscount=0;
const ul= $(".paymentSummary>div:first-of-type");
const couponForm=$("#NeosurfCoupon");



//functions

const updateDatailsOnLetter=()=>{  //apdate personal detils on the letter
    const customerDetails=$(".customerDetails");
    const firstName=storage.getItem("firstName");
    const lastName=storage.getItem("lastName");
    const address=storage.getItem("address");
    const city=storage.getItem("city");
    const zipCode=storage.getItem("zipCode");
    const country=storage.getItem("country");

    customerDetails.find(">div:first-child").text(`${firstName} ${lastName}`);
    customerDetails.find(">div:nth-child(2)").text(address);
    customerDetails.find(">div:nth-child(3)").text(`${city}, ${zipCode}`);
    customerDetails.find(">div:nth-child(4)").text(country);
}

const updateTotalPayment=(total)=>{
    $(".summaryCardContainer footer span:last-of-type").text(`${total.toFixed(2)} \u20AC`)
}

const currentCardsNum=()=>{//return the cards num
   let isOneCard= storage.getItem("isOneCard")=== 'true';
    let cardsNumber=storage.getItem("cardsNumber");
    let title=storage.getItem("title");
    if(title==="Mr" || title==="Mis")
    {
         cardsNumber=!isOneCard?2:1;
    }
    return cardsNumber;
}

const updateDiscountAndSumForOrder=({discount,isPerCard})=>{//update total discont.  sum -when the discount is per order
    if(isPerCard)
    {
        const thisDiscout=discount*Number(currentCardsNum())
        totalDiscount+=thisDiscout;
    }
    else{
       sum-=discount;
        totalDiscount+=discount;
    }
    updateTotalPayment(sum);
}
const updateDiscountDescription=({discount,isPerCard},discountName)=>{//discount in summary card
   let discountStr="";
   let per=""
    if(isPerCard)
    {
        per="per card"
    }
    else{
        per="per order"
    }
    discountStr=`<li class='${discountName.toLowerCase()}'><div><span>${discountName} ${per}</span><span>-${discount}€</span></div></li>`
    ul.append(discountStr);
    updateTotalDiscountDescription();
}
const updateTotalDiscountDescription=()=>{//total discount in summary card
    let totalDiscountElement=ul.find("li.totalDiscount");
    const totalDiscountStr=`-${totalDiscount}€`
    if(totalDiscountElement.length===0)
    {
        totalDiscountElement=`<li class='totalDiscount'><div><span>Total discount</span><span>${totalDiscountStr}</span></div></li>`;
        
    }
    else{
        totalDiscountElement.remove();
         totalDiscountElement.find("span:nth-of-type(2)").text(totalDiscountStr);
    }
    ul.append(totalDiscountElement);
}
const updateTotalDiscountSumAfterDelete=()=>{//after delete card
    if(totalDiscount>0)
    {
        const couponDiscount=JSON.parse(storage.getItem("couponDiscount"));
        const sponsershipDiscount=JSON.parse(storage.getItem("sponsershipDiscount"));
        if(couponDiscount  && couponDiscount.isPerCard)
           totalDiscount-=couponDiscount.discount;
        if(sponsershipDiscount && sponsershipDiscount.isPerCard)
           totalDiscount-=sponsershipDiscount.discount;
        updateTotalDiscountDescription();
    }
}
const updateSummaryHeight =()=>{
    $(".summaryCardContainer").css({ height:($(".cardDetails").height()+ul.height()+$(document.couponForm).height()+200)})
}
const oneCardPayment=ul.find("li:first-of-type");
const updateSummeryCard=()=>{
    sum=0;
    totalDiscount=0;
    let cardPrice=+storage.getItem("cardPrice");
    const orderDetailsUl=$(".cardDetails div");  
    const title=storage.getItem("title");
    const firstDeposit1=storage.getItem("firstDeposit1");
    const firstDeposit2=storage.getItem("firstDeposit2");

    const deleteFirstDeposit=(e)=>{//update after delete first depodit
        let firstDeposit=storage.getItem("firstDeposit1");
        const nodeToRemove= $(e.target).parent().parent();//to remove from summary card
        const cardName=nodeToRemove.parent().attr("name");
        const cardNumber=Number(cardName[cardName.length-1]) || 1;
        if(cardNumber===2)
            firstDeposit=storage.getItem("firstDeposit2");
        sum-= Number(firstDeposit);//update the sum
        updateTotalPayment(sum);
        storage.setItem(`firstDeposit${cardNumber}`,0)
        nodeToRemove.addClass("display-none");
        form2.find(`[name=firstDeposit${cardNumber}]`).val(0) ;//change the first deposit on select
        selectStyle();       
    }

    const deleteOneCard=(e)=>{//from cards
        let firstDeposit=storage.getItem("firstDeposit1");
        let cardPrice=+storage.getItem("cardPrice")
        const cardsNumberVal=storage.getItem("cardsNumber");
        selectStyle();
        const nodeToRemove= $(e.target).parent().parent().parent();//to remove from summary card
        let spanToRemove= form1.find(`span[name=${nodeToRemove.attr("name")}]`) ;//to remove from page1
        let deposit=storage.getItem("firstDeposit2");
        if(title==="Corporate" || title==="Association"){
             $(form1.find(`[name=cardsNumber]`)).val(cardsNumberVal-1);//update the select on form2
            const cardsNumberName="cardsNumber"
            const UpdatedcardsNumber=+storage.getItem(cardsNumberName)-1;
            storage.setItem(cardsNumberName,UpdatedcardsNumber)
            deposit=firstDeposit;
            spanToRemove=form1.find(`.cards span[name=${nodeToRemove.attr("name")}]`) ;//in summary card
            spanToRemove.remove();//in step 1
            updateNumCardOnDetailsSummary(UpdatedcardsNumber);
            sum-=(cardPrice);
            
        }
        else{
            orderDetailsCardTwo.addClass("display-none");//remove the iban text from order summary
            //its should be the second card of individual cards so set it on page 1
            addCard.classList.remove("display-none");
             storage.setItem("isOneCard",true);
            form2.find(".firstDeposit2").addClass("display-none")
            spanToRemove.addClass("display-none");
            updateNumCardOnDetailsSummary(1)
            const firstDepositSum=Number(!!deposit?deposit:0)
            sum-=(cardPrice+firstDepositSum)
        }
        updateTotalDiscountSumAfterDelete();
        storage.removeItem($(spanToRemove.find("input")[0]).attr("name"))//remove the customField from storage
        storage.removeItem($(spanToRemove.find("input")[1]).attr("name"));//remove the iban from storage
        nodeToRemove.remove();
        updateTotalPayment(sum);
        updateSummaryHeight();
        
    }
    const addCardSummery=(i,cardPayment)=>{//add a card to the summary
       sum+=cardPayment;
      
        let oneCardClone=oneCardPayment.clone();
        oneCardClone.attr("name",`card${i}`);
        const ibanType=storage.getItem(`iban${i}`)
        const customField=storage.getItem(`customField${i}`)
        let customString=""
        if(customField){
            customString=`, Custom Field: ${customField}`
        }
        oneCardClone.find("div:first-of-type span:first-of-type").text(` 1 X card (annual fees), Iban: ${ibanType}${customString}`)
        .prepend("<i class='fa fa-trash-o'></i>");//add the trash icon
        oneCardClone.find("div:first-of-type span:first-of-type .fa").click(deleteOneCard);//add event when clicking on trash icon
        oneCardClone.find("div:nth-of-type(2)").remove();
        ul.append(oneCardClone);
    }
    const addFirstDepositToSummary=(firstDepositSum,whereToAppend)=>{
        
        let firstDepositElement =$(whereToAppend).find(">div:nth-of-type(2)");
        if(firstDepositSum>0)//if first deposit bigger then 0 ,add first deposit to the summary card
        {
            if(firstDepositElement.length===0)//if there isn't firstDepositElement
            {
                firstDepositElement=oneCardPayment.find(">div:nth-of-type(2)").clone();
                firstDepositElement.find("span:nth-of-type(2)").text(`${Number(firstDepositSum).toFixed(2)} \u20AC`);
                firstDepositElement.find(".fa").click(deleteFirstDeposit);//delete first deposit when click on trash icon
                $(whereToAppend).append(firstDepositElement);//where to appent- first card or second
            }
            else{
                firstDepositElement.removeClass("display-none");//remove it and paste onethe bottom
            } 
            sum+=Number(firstDepositSum)   
        }
        else{
            firstDepositElement.addClass("display-none")
        }
    }
    ul.empty();//remove all the cards and paste from the begining

    //add the order summary
    const orderDetailsCardOne=orderDetailsUl.find(".orderDetailsCardOne");
    orderDetailsCardOne.removeClass("display-none")
    .text(`IBAN: ${storage.getItem("iban")}`);
    let orderDetailsCardTwo =orderDetailsUl.find(".orderDetailsCardTwo");
    orderDetailsCardTwo.addClass("display-none"); 

    let isOneCard= storage.getItem("isOneCard")=== 'true';
    if(title==="Corporate" || title==="Association" || !isOneCard){
        
        if(title==="Corporate" || title==="Association"){
            let fixed=oneCardPayment.find(">div:first-of-type").clone();//add fixed upgrade
            orderDetailsUl.find(".orderDetailsCardOne").addClass("display-none")
            
            fixed.addClass("fixed")
            fixed.find("span:first-of-type").text(`Fixed (updrade ${title})`);
            fixed.find("span:last-of-type").text("8\u20AC");
            ul.prepend(fixed);
            sum+=8;
            const cardsNumber=storage.getItem("cardsNumber")
            const cardsSpan=form1.find(`.cards span[name^='card']`)
            for (let i=0;i<cardsNumber;i++){
                const cardName= $(cardsSpan[i]).attr("name");
                const cardIndex=cardName[cardName.length-1];
                addCardSummery(cardIndex,cardPrice);//add card in summary card
            }
        }
        else{//if MR/Mis and there is 2 cards
            addCardSummery("",cardPrice);
            addCardSummery("M2",cardPrice);
           
           if(orderDetailsCardTwo.length==0)//if there isn't card 2 on order summary
           {
            orderDetailsCardTwo=orderDetailsCardOne.clone();//update the order summary
            orderDetailsCardTwo.removeClass("orderDetailsCardOne").addClass("orderDetailsCardTwo");
            orderDetailsUl.append(orderDetailsCardTwo);
           }
           else{
            orderDetailsCardTwo.removeClass("display-none");
           }
           addFirstDepositToSummary(firstDeposit2,ul.find("li:nth-of-type(2)"))
           orderDetailsCardTwo.text(`Second Card IBAN: ${storage.getItem("ibanM2")}`)
        }
        updateSummaryHeight();
        
    }
    else{
        addCardSummery("",cardPrice);
        
    }
    
    const sponsershipDiscount=JSON.parse(storage.getItem("sponsershipDiscount"))
    if(sponsershipDiscount){//if there is sponsership
        updateDiscountAndSumForOrder(sponsershipDiscount);
        updateDiscountDescription(sponsershipDiscount,"Sponsership")    
    }
    const couponDiscount=JSON.parse(storage.getItem("couponDiscount"))
    if(couponDiscount)//if there is coupon
    {
         updateDiscountAndSumForOrder(couponDiscount);
         updateDiscountDescription(couponDiscount,"discount");
         updateTotalDiscountDescription();
    }
    ul.find("li:first-of-type div:first-of-type span:first-of-type i.fa").remove(); //remove the trash icon from the first card on summary
    addFirstDepositToSummary(firstDeposit1,ul.find("li:first-of-type"))
    updateTotalPayment(sum);
 }//end of updateSummeryCard

 


//events


couponForm.find("input").change((e)=>{//add/remove the disabled class
    const button=couponForm.find("button");
    e.target.value!==""?button.removeClass("disabled"):button.addClass("disabled")
})



//validate & submit coupon form;

    const couponInput =document.couponForm.coupon;
    let isLegalCoupon =true;
    $(couponInput).on("focus" ,()=>{
        isLegalCoupon=true;
        $(couponInput).valid();
    })
    validator.addMethod("isValidCoupon",(value,element) => {
    return  isLegalCoupon
 },"The coupon is not valid.");

 couponForm.validate({
    ...globalValidate("#personalDetailsForm"),
      rules: {
          coupon:{
          required: true,
          isValidCoupon:true,
        }
      }
})
couponForm.submit(e=>{
    e.preventDefault();
    const isValid= couponForm.valid();
    if(isValid){
        const formData= new FormData(couponForm[0]);
       
        $.getJSON( "../staticPages/coupon") 
           
        .done(data=>{
            isLegalCoupon=false;//there isnt valid coupon yet
            data.forEach((obj)=>{
                
                if(obj.validCode===formData.get('coupon')){
                    isLegalCoupon=true;//there is validcoupon
                    const prevCoupon=JSON.parse(storage.getItem("couponDiscount"));
                    const couponDiscount={
                        discount:Number(obj.amount),
                        isPerCard:obj.type.includes("per card")
                    }
                    storage.setItem("couponDiscount",JSON.stringify(couponDiscount));
                    let cardPrice=+storage.getItem("cardPrice");
                    if(prevCoupon){//restart the discount of prev coupon if exsist
                        if(prevCoupon.isPerCard){
                            const thisDiscout=prevCoupon.discount*currentCardsNum();
                            sum+=thisDiscout;
                            totalDiscount-=thisDiscout;
                            cardPrice+=prevCoupon.discount;
                            storage.setItem("cardPrice",cardPrice)
                            
                        }
                        else
                        {
                            sum+=prevCoupon.discount;
                            totalDiscount-=prevCoupon.discount;
                        }
                         
                        ul.find(".discount").remove();//remove the prev coupon from summary card
                    }
                 
                   updateCardPrice(couponDiscount);
                   updateDiscountAndSumForOrder(couponDiscount)
                   updateDiscountDescription(couponDiscount,"discount");
                    return;
                }    
           })
           if(!isLegalCoupon)//the coupon is invalid, 
           {
            $(couponInput).valid();
           }

        })
        .fail(( jqXHR,textStatus, errorThrown)=>{
            console.log("jqXHR",jqXHR.responseText);
            console.log("textStatus",textStatus);
            console.log("errorThrown",errorThrown)
        })
    }
    return false;
})    