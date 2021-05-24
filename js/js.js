const card2= document.getElementsByClassName('card2')[0];
const detailsSummary=document.getElementsByClassName("detailsSummary")[0];
const addCard= document.getElementById('addCard');
const deleteCard= document.getElementById('deleteCard');
addCard.onclick=()=>{
    card2.classList.remove("display-none");
    addCard.classList.add("display-none");
    detailsSummary.classList.add("twoCards")
    
 }
 deleteCard.onclick=()=>{
    card2.classList.add("display-none");
    addCard.classList.remove("display-none");
    detailsSummary.classList.remove("twoCards")
 }