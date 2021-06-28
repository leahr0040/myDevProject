
//veribles
let sum=0;
let cardPrice=29.90;
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

const updateNumCardOnDetailsSummary=(cardsNum)=>{//update cards number
    cardsNum>1? $(detailsSummary).find("img:nth-of-type(2)").removeClass("display-none"):$(detailsSummary).find("img:nth-of-type(2)").addClass("display-none");
    $(detailsSummary).find(".one").attr("data-content",cardsNum);
}
const updateTotalPayment=(total)=>{
    $(".summaryCardContainer footer span:last-of-type").text(`${total.toFixed(2)} \u20AC`)
}


const updateSumDiscountPerOrder=(discount,per)=>{
   
    if(per.includes("per card"))
    {
         cardPrice-=discount;
        for(i=0;i<Number(wholeData.cardsNumber) ;i++)
            {
                sum-=discount;
            }
    }
    else{
        sum-=discount;
    }
    updateTotalPayment(sum);
    
}
const updateDiscountDescription=(discount,per,discountName)=>{
    let discountStr=""
    if(per.includes("per card"))
    {
         discountStr=`<li><div><span>${discountName} per card</span><span>${discount}€</span></div></li>`              
    }
    else{
        discountStr=`<li><div><span>${discountName} per order</span><span>${discount}€</span></div></li>`
    }
    ul.append(discountStr);
    if(discountName.includes('discount'))
    discountOfCoupon=discountStr;
}
const oneCardPayment=ul.find("li:first-of-type");
const updateSummeryCard=()=>{
    sum=0;
    //cardPrice=29.9;
    
    const {title,firstDeposit1,firstDeposit2,reward}=wholeData;
    const firstDeposit=firstDeposit1;

    const deleteFirstDeposit =(e)=>{//update after delete first depodit
        const nodeToRemove= $(e.target).parent().parent();
        const cardName=nodeToRemove.parent().attr("name");
        sum-= Number(firstDeposit);
        updateTotalPayment(sum);
        const cardNumber=Number(cardName[cardName.length-1]) || 1;
        wholeData[`firstDeposit${cardNumber}`]=0;
        nodeToRemove.addClass("display-none");
        form2.find(`[name=firstDeposit${cardNumber}]`).val(0) ;
        selectStyle();
        
    }



    const deleteOneCard=(e)=>{
        const cardsNumberVal= wholeData.cardsNumber;
        $(form1.find(`[name=cardsNumber]`)).val(cardsNumberVal-1);
        selectStyle();
        const nodeToRemove= $(e.target).parent().parent().parent();
        let spanToRemove= form1.find(`span[name=${nodeToRemove.attr("name")}]`) ;
        let deposit=firstDeposit2;
        if(title==="Corporate" || title==="Association"){ 
            wholeData.cardsNumber--;
            deposit=firstDeposit;
            spanToRemove=form1.find(`.cards span[name=${nodeToRemove.attr("name")}]`) ;
        }
        else{
            addCard.classList.remove("display-none");
            isOneCard=true;
            form2.find(".firstDeposit2").addClass("display-none")
            spanToRemove.addClass("display-none")
        }
        
        delete wholeData[$(spanToRemove.find("input")[0]).attr("name")]
        delete wholeData[$(spanToRemove.find("input")[1]).attr("name")]
        nodeToRemove.remove();
        sum-=(cardPrice+Number(deposit))
        updateTotalPayment(sum);
    }
    
    const addCardSummery=(firstDepositPayment,i,cardPayment)=>{//add a card in the summary
        sum+=Number(firstDepositPayment)+cardPayment;
        let oneCardClone=oneCardPayment.clone();
        //const name=`card${i}`
        oneCardClone.attr("name",`card${i}`)
        const ibunType= wholeData[`ibun${i}`];
        const customField=wholeData[`customField${i}`];
        let customString=""
        if(customField){
            customString=`, Custom Field: ${customField}`
        }
        oneCardClone.find("div:first-of-type span:first-of-type").text(` 1 X card (annual fees), Ibun: ${ibunType}${customString}`).prepend("<i class='fa fa-trash-o'></i>");
        //oneCardClone.find("div:first-of-type span:first-of-type .fa").css({"position":"absolute","left":"0","top":"0"})
        oneCardClone.find("div:first-of-type span:first-of-type .fa").click(deleteOneCard);
        const firstDepositElement =oneCardClone.find("div:nth-of-type(2)");
        if(Number(firstDepositPayment)>0)
        {
            firstDepositElement.removeClass("display-none");
            firstDepositElement.find("span:nth-of-type(2)").text(`${Number(firstDepositPayment).toFixed(2)} \u20AC`);
            if(wholeData.title==="Mr" || wholeData.title==="Mis")
            {
                firstDepositElement.find(".fa").click(deleteFirstDeposit);
                firstDepositElement.find(".fa").css("color","#f52e2e")
            }
            else{
                firstDepositElement.find(".fa").css("color","white")
            }
        }
        else{
            firstDepositElement.addClass("display-none");
        }
        ul.append(oneCardClone);
    }
    ul.empty();
    if(title==="Corporate" || title==="Association" || !isOneCard){
        
        if(title==="Corporate" || title==="Association"){
            let fixed=oneCardPayment.find(">div:first-of-type").clone();
            fixed.addClass("fixed")
            fixed.find("span:first-of-type").text(`Fixed (uergade ${title})`);
            fixed.find("span:last-of-type").text("8\u20AC");
            ul.prepend(fixed);
            sum+=8;
            const {cardsNumber}=wholeData;
            for (let i=0;i<cardsNumber;i++){
                addCardSummery(firstDeposit,i+1,cardPrice);
            }
        }
        else{
            addCardSummery(firstDeposit,"",cardPrice);
            addCardSummery(firstDeposit2,"2",cardPrice);
        }
        if(reward){
            updateDiscountDescription(reward.split(" ")[0],reward,"Sponsership")
            if(!isSumUpdated)
            {
                updateSumDiscountPerOrder(Number(reward.split(" ")[0]),reward);
                isSumUpdated=true;
            }
        }
        if(discountOfCoupon)
            ul.append(discountOfCoupon);
        
        $(".summaryCardContainer").css({ height:(ul.height()*2+$(document.couponForm).height())})//$(".summaryCardContainer").height()+
    }
    else{
        addCardSummery(firstDeposit,"",cardPrice);
        sum=cardPrice+Number(firstDeposit);
    }
    ul.find("li:first-of-type div:first-of-type span:first-of-type i.fa").remove(); 
    updateTotalPayment(sum);
 }//end of updateSummeryCard

//events

couponForm.find("input").change((e)=>{
    const button=couponForm.find("button");
    e.target.value!==""?button.removeClass("disabled"):button.addClass("disabled")
})



//validate & submit coupon form


 couponForm.validate({
    ...globalValidate("#personalDetailsForm"),
      rules: {
          coupon:{
          required: true
        }
      }
})
couponForm.submit(e=>{
    e.preventDefault();
    const isValid= couponForm.valid();
    if(isValid){
        const formData= new FormData(couponForm[0]);
       couponForm.remove();
        $.getJSON( "../staticPages/coupon")    
        .done(data=>{
            data.forEach((obj)=>{
                if(obj.validCode===formData.get('coupon')){
                   const discount=Number( obj.amount);
                   updateDiscountDescription(discount,obj.type,"discount");
                   updateSumDiscountPerOrder(discount,obj.type);
                //    if(obj.type.toLowerCase().includes("per card"))
                //    {
                //         cardPrice-=discount;
                //         discountOfCoupon=`<li><div><span>discount per card</span><span>${discount}€</span></div></li>`
                //         ul.append(discountOfCoupon);
                //         updateSumDiscountPerOrder(discount);
                //         // for(i=0;i<Number(wholeData.cardsNumber);i++)
                //         // {
                //         //     sum-=discount;
                //         // }
                //    }
                //    else{
                //         discountOfCoupon=`<li><div><span>discount per order</span><span>${discount}€</span></div></li>`
                //         ul.append(discountOfCoupon);
                //         sum-=discount;
                //    }
                //    updateTotalPayment(sum);
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
    return false;
})    