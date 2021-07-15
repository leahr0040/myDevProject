//all veribles

const card2 = document.getElementsByClassName("cardM2")[0]; //
const detailsSummary = document.getElementsByClassName("detailsSummary")[0];
const addCard = document.getElementById("addCard");
const deleteCard = document.getElementById("deleteCard");
let isSeeded = false;
const form1 = $("#personalDetailsForm");
const fieldsOfForm = form1.find(">div>span");
const Iban = $(".ibanSapn");
// let firstName = "",
//   lastName = "",
//   corporateName = "",
//   corporateStructure = "",
//   associationName = "";
//const titleValues = [$(document.personalDetailsForm.title).val()];
const validator = $.validator;
const inputs = document.personalDetailsForm.elements;
const customField = document.personalDetailsForm.customField;
const fullName = [inputs[4], inputs[5]];
const fullNameLength = 26;
const detailsOnCard = $(".pict>div:first-child>div");
const fullNameOnCard = detailsOnCard.find("div:nth-child(2)");
const customFieldOnCard = detailsOnCard.find("div:nth-child(3)");

//all function definition

const camelCaseToSentence = (str) => {
  return str.replace(/([A-Z]|[0-9])/g, " $1").toLowerCase();
};

const changeIban = (e) => {
  //change the text according to which iban was choosen
  $(e.target)
    .parents(".ibanSapn")
    .find("span")
    .text(`IBAN ${e.target.value.toUpperCase()}`);
};
const changeFieldsName = (firstName, lastName, nameDate) => {
  //function to change the labels when change the title
  $(fieldsOfForm[0]).find("label:first-of-type").text(firstName);
  $(fieldsOfForm[0]).find("input").text(firstName);
  $(fieldsOfForm[1]).find("label:first-of-type").text(lastName);
  form1.find("[for=dateOfBirth]:first-of-type").text(nameDate);
};
const changeNameOfFirstField = (name) => {
  //change the name of first field when change the title
  $(fieldsOfForm[0])
    .find("label:first-of-type")
    .text(camelCaseToSentence(name))
    .attr("for", name);
  $(fieldsOfForm[0]).find("input").attr("name", name);
};
const titleChanges = (titleValue) => {
  //all the changes that when change the title
  const add = $(".organization");
  const card = $(".card1"); // card one of MR/Mis
  const card2 = $(".cardM2"); //card two of MR/Mis  
  const formTitle = form1.find(".formTitle");
  if (titleValue === "Corporate" || titleValue === "Association") {
    //update the data that saved on fields
    updateCustomFieldOnCard("");
    formTitle.text(`${titleValue.toUpperCase()} INFORMATION`);
    if (titleValue === "Association") {
      changeFieldsName("Company Name","Corporate Structure", "Date of birth person in charge"); //change the labels of the inputs
      $(fieldsOfForm[1]).addClass("display-none");
      changeNameOfFirstField("associationName"); //change the name of first input;

      const associationName=storage.getItem("associationName")
      //if (associationName)
        $(document.personalDetailsForm.associationName).val(associationName);//put the association prev value on field

      updateFullNameOnCard(fullName[0].value, "");
      $(document.personalDetailsForm.associationName).attr("maxlength", 20);
    } 
    else {
      changeNameOfFirstField("firstName");
      $(fieldsOfForm[1]).removeClass("display-none");
      changeFieldsName( "Company Name","Corporate Structure","Date of birth person in charge");
      
      const corporateName=storage.getItem("corporateName"),corporateStructure=storage.getItem("corporateStructure");
      //if (corporateName)
        $(document.personalDetailsForm.firstName).val(corporateName);//put the corporateName prev value on field
     // if (corporateStructure)
        $(document.personalDetailsForm.lastName).val(corporateStructure);//put the corporateStructure prev value on field
      updateFullNameOnCard();//update full name on credit card
    }
    //remove the Mr/Mis data and show the rellvant data
    const customizeDiv = add.find(".customizeConfirm");
    const customizeInput = customizeDiv.find("#Customize");
    add.removeClass("display-none");
    let cardClone = card.clone();
    card.addClass("display-none");
    card2.addClass("display-none");
    cardClone.addClass("mt-3");
    cardClone
      .find("[for=customField]")
      .text("Indicate here the desired customization")
      .css("font-size", ".84em");
    let cards = add.find(".cards");

    function cardToAdd(name) {
      //return clone of one card in order to add it to ul
      let a = cardClone.clone(true);
      const customField = storage.getItem(`customField${name}`);
      let iban = storage.getItem(`iban${i + 1}`);
      let customFieldVal = "";
      if (customField) {
        customFieldVal = customField;
      }

      a.removeClass("display-none").removeClass("card1");
      a.attr("name", `card${name}`);
      a.find(">span:first-of-type input")
        .attr("name", `customField${name}`)
        .val(customFieldVal);
      a.find(">span:nth-of-type(2) input")
        .attr("name", `iban${name}`)
        .on("change", changeIban);
      if (iban) {//if there is iban on local storage
        a.find(".ibanSapn span").text(`IBAN ${iban.toUpperCase()}`);//change the iban text to the correct iban
      } else {
        storage.setItem(`iban${i + 1}`, "UK");//if no, set it.
      }
      return a;
    }

    const cardsChange = (cardsNum) => {//when change the number of selected cards
      cards.empty();
      for (i = 0; i < cardsNum; i++) {
        cards.append(cardToAdd(i + 1));
        let iban = storage.getItem(`iban${i + 1}`);
        if (iban) {
          document.personalDetailsForm[`iban${i + 1}`].value = iban;//set the value of the the radio iban to the storage value
        }
        setLocalOnFieldsChange()//updatethe new fields to save value on local storage when they changed
      }
      updateNumCardOnDetailsSummary(cardsNum);
    };
    if (cards.length === 0) {//if this is the first time to change to corporate or association
      
      const customize = storage.getItem("Customize") === "true";
      if (customize === true) 
        customizeInput[0].checked = true;
      else 
        customizeInput[0].checked = false;

      cardClone.find("#addCard").remove();
      customizeDiv.after(
        `<div class='cards ${
          customizeInput[0].checked === true ? "" : "display-none"
        }'></div>`
      );
      cards = add.find(".cards");

      let options = "";
      for (i = 0; i < 6; i++) {
        options += `<option  value=${i + 1} >${i + 1} cards </option>`;
      }
      const sel = add.find(" select");
      sel.append(options).on("change", (e) => cardsChange(+e.target.value)); //add cards option to the select

      //local storage
      const cardsNumber = storage.getItem("cardsNumber");
      if (+cardsNumber) {
        sel.val(cardsNumber);
        cardsChange(+cardsNumber);//create the number of the cards
      }
      
      selectStyle(); //when update a select element should refresh the plugin
    }
    updateNumCardOnDetailsSummary(Number(add.find(" select").val()));
    customizeInput.on("change", (e) => {
      //when change the checkbox of Customize & IBAN selection
      const cards = add.find(".cards");
      if (e.target.checked) cards.removeClass("display-none");
      else cards.addClass("display-none");
    });
  } 
  else {
    //if Mr or Mis
    let isOneCard = storage.getItem("isOneCard") === "true";
    updateNumCardOnDetailsSummary(!!isOneCard ? 1 : 2);
    formTitle.text("PERSONAL DETAILS");
    add.addClass("display-none");
    card.removeClass("display-none");
    if (!isOneCard) {
      onTwoCards();
    }

    changeNameOfFirstField("firstName");
    changeFieldsName("First Name", "Last Name", "Date of birth");
    $(fieldsOfForm[1]).removeClass("display-none");

    const prevFirstName=storage.getItem("prevFirstName"),prevLastName=storage.getItem("prevLastName");
   // if (prevFirstName)
      $(document.personalDetailsForm.firstName).val(prevFirstName );
      
   // if (prevLastName)
      $(document.personalDetailsForm.lastName).val(prevLastName );
     
    updateCustomFieldOnCard(customField.value);
    updateFullNameOnCard();
  }
  setLocalOnFieldsChange();//add onchange(to set the storage) to all the firld that added
}; //end of change title

function updateFullNameOnCard( fname = fullName[0].value,lname = fullName[1].value) {//on credit card
  fullNameOnCard.text(`${fname} ${lname}`);
}

function updateCustomFieldOnCard(custom) { //on credit card
  customFieldOnCard.text(custom);
}

const updateDateOnCard = () => {//on credit card
  const date = new Date();
  detailsOnCard
    .find("div:first-child")
    .text(
      `${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}/${
        (date.getFullYear() + 2) % 100
      }`
    );
};

const onTwoCards = () => {
  card2.classList.remove("display-none");//show the second card
  addCard.classList.add("display-none");//hide the add card button
  updateNumCardOnDetailsSummary(2);//update 2 cards
  addCardFirstDepodit();//call the function that treats on add first deposit if needed
  storage.setItem("isOneCard", false);
  storage.setItem("ibanM2", document.personalDetailsForm.ibanM2.value);
};

const onOneCard = () => {
  card2.classList.add("display-none");
  addCard.classList.remove("display-none");
  updateNumCardOnDetailsSummary(1);
  removeCardFirstDepodit();
  storage.setItem("isOneCard", true);
};
const masking = () => {
  const inputmask_options = {
    mask: "99/99/9999",
    alias: "date",
    placeholder: "dd/mm/yyyy",
    insertMode: false,
  };

  $(document.personalDetailsForm.dateOfBirth).inputmask( "99/99/9999",inputmask_options);//mask to the date
   
    
  
  $(document.detailsForm.phoneNumber).inputmask("9{*}[-]9{*}", {
    showMaskOnFocus: false,
    showMaskOnHover: false,
    jitMasking: true,
  });
};//mask to the phone to prevent latters

//events

form1.find("input[name=title]").on("change", (e) => {//on title changed
  titleChanges(e.target.value);
});

Iban.find("input").on("change", changeIban);//on iban changed

addCard.onclick = () => {//on add card (on indivdual title)
  setOneFormToNotCompleted("personalDetailsForm");//set the forms to not completed 
  setOneFormToNotCompleted("detailsForm");//set the forms to not completed 
  onTwoCards();
};

deleteCard.onclick = () => {//on delete card (on indivdual title)
  setOneFormToNotCompleted("personalDetailsForm");//set the forms to not completed 
  setOneFormToNotCompleted("detailsForm");//set the forms to not completed 
  onOneCard();
};

$(fullName).on("change textInput input", (e) => {//when change the full name .also change on credit card
  const title = storage.getItem("title");
  if (title === "Association") updateFullNameOnCard(fullName[0].value, "");
  else {
    let fName = "prevFirstName";
    let lName = "prevLastName";
    updateFullNameOnCard();
    if (title === "Corporate") {
      fName = "corporateName";
      lName = "corporateStructure";
    }
    storage.setItem(fName, $(document.personalDetailsForm.firstName).val());//update the prev first nameon storage
    storage.setItem(lName, $(document.personalDetailsForm.lastName).val());//update the prev first nameon storage
  }
  let index = e.target === fullName[0] ? 1 : 0;//the index of the field that doesn't changed now Among the full name fields
  let length = e.target.value.length;
  $(fullName[index]).attr("maxlength", fullNameLength - length);//limit the field that doesn't changed-the second field according this field
  if ($(fullName[index]).val().length >= fullNameLength - length)//if the second field is larger then its limit
    $(e.target).attr("maxlength", length);//limit this field
});

$(customField).on("change textInput input", (e) => {
  updateCustomFieldOnCard(customField.value);
});


  setLocalStorageSomeItems();
 checkUrlParams();
 updateDateOnCard();
updateFullNameOnCard();
updateCustomFieldOnCard(customField.value);
if (!isSeeded) {
  setTheFieldsWithLocalStorage();
  setLocalStorageWithInitialFieldsValue();
  setLocalOnFieldsChange();
}
selectStyle();
masking();


//valid the first form

const globalValidate = (form) => {//for all the forms
  return {
    errorClass: "invalid",
    highlight: function (element, errorClass, validClass) {
      $(element).addClass(errorClass).removeClass(validClass);
      $(`${form} [for=${element.id}]`).addClass(errorClass + "Label");
      if (element.name.includes("confirm"))
        $(".labelConfirm>span:first-child").addClass("invalidLabel");
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass(errorClass).addClass(validClass);
      $(`${form} [for=${element.id}]`).removeClass(errorClass + "Label");
      if (element.name.includes("confirm"))
        $(".labelConfirm>span:first-child").removeClass("invalidLabel");
    },
  };
};

const vaildDateFromString = (str) => {//get date from user and return valid date
  
  const [d, m, y] = str.split("/");
  return new Date(y, Number(m - 1), d);
};

validator.addMethod(
  "isAdult",
  (value, element, params) => {
    return (
      vaildDateFromString(value) <=
      new Date().setFullYear(new Date().getFullYear() - 18)
    );
  },
  "Must be at least 18 years old."
);

validator.addMethod(
  "validDate",
  (value, element, params) => {
    return (
      /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/.test(
        value
      ) && vaildDateFromString(value) < new Date()
    );
  },
  "Please enter a valid date."
);

validator.addMethod(
  "fullNameLength",
  (value, element) => {
    return fullName[0].value.length + fullName[1].value.length <= 26;
  },
  "Full name length is longer than 26 characters."
);

validator.addMethod(
  "deliveryMaxLength",
  (value, element, param) => {
    return value.length < param;
  },
  (param, element) => {
    //
    const name = camelCaseToSentence(element.name);
    return `The ${name} may not be greater than ${param} characters.`;
  }
);

$("#personalDetailsForm").validate({
  ...globalValidate("#personalDetailsForm"),
  rules: {
    firstName: {
      required: true,
    },
    lastName: {
      required: true,
      fullNameLength: true,
    },
    companyName: {
      required: true,
    },
    corporateStructure: {
      required: true,
    },
    associationName: {
      required: true,
      maxlength: 20,
    },
    customField: {
      maxlength: 10,
    },
    dateOfBirth: {
      required: true,
      validDate: true,
      isAdult: true,
    },
    confirm1: {
      required: true,
    },
  },
  messages: {},
});

//submit

form1.submit((e) => {
  e.preventDefault();
  const isValid = form1.valid();
  if (isValid) {
    location.href = "#page2";
    const title = storage.getItem("title");
    if (title === "Corporate" || title === "Association") {
      removeCardFirstDepodit(); //remove first deposit 2
    } 
    else 
      addCardFirstDepodit(); //מטפלת בהוספת firstDeposit2 אם נצרך
    setOneFormToCompleted("personalDetailsForm");
    isForm1submited = true;
  } 
  else {
    setOneFormToNotCompleted("personalDetailsForm");
  }
  return false;
});
