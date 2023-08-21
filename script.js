const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_+-={}[]:";<>?/,.|/';


let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//Set strength circle color to grey



function shufflePassword(array){
    // Fisher Yates algo is used to shuffle an array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
//Its function is reflect the changes in length of a password in the UI
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //Set shadow is homework
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6)
    {
        setIndicator("ff0");
    }
    else 
    {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
   }
   catch(e){
        copyMsg.innerText="Failed";
   }

   copyMsg.classList("active");

   setTimeout(() =>{
        copyMsg.classList.remove("active");
   },2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',  () =>{
    if(passwordDisplay.value)  // if the field is non-empty
       copyContent();
});

generateBtn.addEventListener('click', () =>{
   if(checkCount == 0)
    return;

   if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider();
   }

   //To find the old password we need to remove the old password

   password="";

    /*
    if(uppercaseCheck.checked)
      password+=generateUpperCase();

    if(lowercaseCheck.checked)
      password+=generateLowerCase();
    
    if(numbersCheck.checked)
      password+=generateRandomNumber();

    if(symbolsCheck.checked)
      password+=generateSymbol();

    */    

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
        
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Adding all the checked boxes   
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    console.log('Compulsory addition Done')
    //Adding the remaining length
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log('randIndex'+ randIndex)
        password+=funcArr[randIndex]();
    }

    //Shuffle the password
    password=shufflePassword(Array.from(password));
    console.log('Shuffling Done');

    //Show in the UI
    passwordDisplay.value=password;
    console.log("Displaying in UI done")

    //Calculate strength of the password
    calcStrength();
})

