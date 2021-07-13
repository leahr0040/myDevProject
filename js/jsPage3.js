
//veribles
let sum=0;
let cardPrice=29.90;
let totalDiscount=0;
const ul= $(".paymentSummary>div:first-of-type");
const couponForm=$("#NeosurfCoupon");
let discountOfCoupon="";
isSumUpdated=false;




//functions

const updateDatailsOnLetter=()=>{  //apdate personal detils on the letter
    const customerDetails=$(".customerDetails");
    const {firstName, lastName,address,city,zipCode,country}=wholeData
    customerDetails.find(">div:first-child").text(`${firstName} ${lastName}`);
    customerDetails.find(">div:nth-child(2)").text(address);
    customerDetails.find(">div:nth-child(3)").text(`${city}, ${zipCode}`);
    customerDetails.find(">div:nth-child(4)").text(country);
}

const updateNumCardOnDetailsSummary=(cardsNum)=>{//update cards number on the letter
    cardsNum>1? $(detailsSummary).find("img:nth-of-type(2)").removeClass("display-none"):$(detailsSummary).find("img:nth-of-type(2)").addClass("display-none");
    $(detailsSummary).find(".one").attr("data-content",cardsNum);
}
const updateTotalPayment=(total)=>{
    $(".summaryCardContainer footer span:last-of-type").text(`${total.toFixed(2)} \u20AC`)
}

const currentCardsNum=()=>{//return the cards num
    let {cardsNumber,title}=wholeData;
    if(title==="Mr" || title==="Mis")
    {
         cardsNumber=!isOneCard?2:1;
    }
    return cardsNumber;
}
const updateCardPrice=({discount,isPerCard})=>{//when update a new discount
    if(isPerCard)
    {
        cardPrice-=discount;
        sum-=(discount*currentCardsNum())
    }
}
const updateSponsershipReward=(reward)=>{//update the sponsership discount details in whole data
    wholeData.sponsershipDiscount={
        discount:Number(reward.split(" ")[0]),
        isPerCard:reward.includes("per card")
    }
    updateCardPrice(wholeData.sponsershipDiscount);
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
    if(discountName.includes('discount'))
    discountOfCoupon=discountStr;
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
        const {couponDiscount,sponsershipDiscount}=wholeData;
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
    const orderDetailsUl=$(".cardDetails div");
    
    const {title,firstDeposit1,firstDeposit2,reward}=wholeData;
    

    //change
    const deleteFirstDeposit=(e)=>{//update after delete first depodit
        let firstDeposit=wholeData.firstDeposit1;
        const nodeToRemove= $(e.target).parent().parent();
        const cardName=nodeToRemove.parent().attr("name");
        
        const cardNumber=Number(cardName[cardName.length-1]) || 1;
        if(cardNumber===2)
        firstDeposit=wholeData.firstDeposit2;
        sum-= Number(firstDeposit);
        updateTotalPayment(sum);
        wholeData[`firstDeposit${cardNumber}`]=0;
        nodeToRemove.addClass("display-none");
        form2.find(`[name=firstDeposit${cardNumber}]`).val(0) ;
        selectStyle();
        
    }

    //change
    const deleteOneCard=(e)=>{//from cards
        let firstDeposit=wholeData.firstDeposit1;
        const cardsNumberVal= wholeData.cardsNumber;
        
        selectStyle();
        const nodeToRemove= $(e.target).parent().parent().parent();
        let spanToRemove= form1.find(`span[name=${nodeToRemove.attr("name")}]`) ;
        let deposit=wholeData.firstDeposit2;
        if(title==="Corporate" || title==="Association"){ 
            $(form1.find(`[name=cardsNumber]`)).val(cardsNumberVal-1);
            wholeData.cardsNumber--;
            deposit=firstDeposit;
            spanToRemove=form1.find(`.cards span[name=${nodeToRemove.attr("name")}]`) ;//in summary card
            spanToRemove.remove();//in step 1
            updateNumCardOnDetailsSummary(wholeData.cardsNumber);
            sum-=(cardPrice);
            
        }
        else{
            addCard.classList.remove("display-none");
            isOneCard=true;
            form2.find(".firstDeposit2").addClass("display-none")
            spanToRemove.addClass("display-none");

            //change
            orderDetailsCardTwo.addClass("display-none");
            updateNumCardOnDetailsSummary(1)
            const firstDepositSum=Number(!!deposit?deposit:0)
            sum-=(cardPrice+firstDepositSum)
        }
        updateTotalDiscountSumAfterDelete();
        delete wholeData[$(spanToRemove.find("input")[0]).attr("name")]
        delete wholeData[$(spanToRemove.find("input")[1]).attr("name")]
        nodeToRemove.remove();
        updateTotalPayment(sum);
        updateSummaryHeight();
        
    }
    const addCardSummery=(i,cardPayment)=>{//add a card to the summary
       sum+=cardPayment;

        let oneCardClone=oneCardPayment.clone();
        oneCardClone.attr("name",`card${i}`);
        const ibanType= wholeData[`iban${i}`];
        const customField=wholeData[`customField${i}`];
        let customString=""
        if(customField){
            customString=`, Custom Field: ${customField}`
        }
        oneCardClone.find("div:first-of-type span:first-of-type").text(` 1 X card (annual fees), Iban: ${ibanType}${customString}`).prepend("<i class='fa fa-trash-o'></i>");
        oneCardClone.find("div:first-of-type span:first-of-type .fa").click(deleteOneCard);
        oneCardClone.find("div:nth-of-type(2)").remove();
        ul.append(oneCardClone);
    }
    const addFirstDepositToSummary=(firstDepositSum,whereToAppend)=>{
        let firstDepositElement =$(whereToAppend).find(">div:nth-of-type(2)");
        if(firstDepositSum>0)
        {
            if(firstDepositElement.length===0)
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
    const orderDetailsCardOne=orderDetailsUl.find(".orderDetailsCardOne");
    orderDetailsCardOne.removeClass("display-none")
    .text(`IBAN: ${wholeData.iban}`);
    let orderDetailsCardTwo =orderDetailsUl.find(".orderDetailsCardTwo");
    orderDetailsCardTwo.addClass("display-none"); 
    if(title==="Corporate" || title==="Association" || !isOneCard){
        
        if(title==="Corporate" || title==="Association"){
            let fixed=oneCardPayment.find(">div:first-of-type").clone();//add fixed upgrade
            orderDetailsUl.find(".orderDetailsCardOne").addClass("display-none")
            
            fixed.addClass("fixed")
            fixed.find("span:first-of-type").text(`Fixed (updrade ${title})`);
            fixed.find("span:last-of-type").text("8\u20AC");
            ul.prepend(fixed);
            sum+=8;
            const {cardsNumber}=wholeData;
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
           
           if(orderDetailsCardTwo.length==0)
           {
            orderDetailsCardTwo=orderDetailsCardOne.clone();//update the order summary
            orderDetailsCardTwo.removeClass("orderDetailsCardOne").addClass("orderDetailsCardTwo");
            orderDetailsUl.append(orderDetailsCardTwo);
           }
           else{
            orderDetailsCardTwo.removeClass("display-none");
           }
           addFirstDepositToSummary(firstDeposit2,ul.find("li:nth-of-type(2)"))
           orderDetailsCardTwo.text(`Second Card IBAN: ${wholeData.ibanM2}`)
        }
        updateSummaryHeight();
        
    }
    else{
        addCardSummery("",cardPrice);
        
    }
    if(wholeData.sponsershipDiscount){//if there is sponsership
        updateDiscountAndSumForOrder(wholeData.sponsershipDiscount);
        updateDiscountDescription(wholeData.sponsershipDiscount,"Sponsership")    
    }
    if(wholeData.couponDiscount)//if there is coupon
    {
         ul.append(discountOfCoupon);
         updateDiscountAndSumForOrder(wholeData.couponDiscount);
         updateTotalDiscountDescription();
    }
    ul.find("li:first-of-type div:first-of-type span:first-of-type i.fa").remove(); 
    addFirstDepositToSummary(firstDeposit1,ul.find("li:first-of-type"))
    updateTotalPayment(sum);
 }//end of updateSummeryCard

//events

couponForm.find("input").change((e)=>{//add qremove the disabled class
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
                    const prevCoupon=wholeData.couponDiscount;
                    wholeData.couponDiscount={
                        discount:Number(obj.amount),
                        isPerCard:obj.type.includes("per card")
                    }
                    if(prevCoupon){//restart the discount of prev coupon if exsist
                        if(prevCoupon.isPerCard){
                            const thisDiscout=prevCoupon.discount*currentCardsNum();
                            sum+=thisDiscout;
                            totalDiscount-=thisDiscout;
                            cardPrice+=prevCoupon.discount;
                            
                        }
                        else
                        {
                            sum+=prevCoupon.discount;
                            totalDiscount-=prevCoupon.discount;
                        }
                         
                        ul.find(".discount").remove();
                    }
                 
                    updateCardPrice(wholeData.couponDiscount);
                 updateDiscountAndSumForOrder(wholeData.couponDiscount)

                   updateDiscountDescription(wholeData.couponDiscount,"discount");
                   wholeData.coupon=wholeData.couponDiscount.discount+' '+obj.type;
                    return;
                }    
           })
           if(!isLegalCoupon)
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