
let currentUserName = document.getElementById("current-user-name");
let userImage = document.getElementById("user-image");
let userUploadImage = document.getElementById("user-upload-image");
let loadingState = document.getElementById("with-draw-loading-state");
let hideBalance = document.getElementById("hide-balance");
let hideShowToggleText = document.getElementById("hide-show-toggle-text");
let logoutBtn = document.getElementById("logout");
let deactivateAccount = document.getElementById("deactivate-account");
let transactionHistoryList = document.getElementById("transaction-history-list");
let transactionuserName = document.getElementById("transaction-user-name");
let viewAccountDetails  = document.getElementById("view-account-details");
loadingState.style.display = "none";
let userDetailsHide = document.getElementById("user-details-hide");
userDetailsHide.style.display = "none";
// let senderForm = document.getElementById("sender-form");
let sendMoney = document.getElementById("send-money");
let senderForm = document.getElementById("sender-form");
senderForm.style.display = "none";
let withDraw = document.getElementById("with-draw");
let deposit = document.getElementById("deposit");
let currentBalance = document.getElementById("currentBalance");
let userDetailsHeading = document.getElementById("user-details-heading");
userDetailsHeading.style.display = "none";
let refreshBalance = document.getElementById("refresh-balance");
console.log(currentBalance)
let transactionHistory = document.getElementById("transaction-history");
let withDrawInput = document.getElementById("with-draw-input");
let userDetails = JSON.parse(localStorage.getItem("userDetails")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
console.log(currentUser);
let updatedBalance;


  userUploadImage.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        userImage.src = e.target.result;
        userImage.style.display = "block";
      };


      reader.readAsDataURL(file);


    }
  });


refreshBalance.addEventListener("click", function () {
    currentBalance.classList.remove("visible", "invisible"); // remove custom classes
    loadingState.style.visibility = "visible";
    currentBalance.style.visibility = "hidden";

    setTimeout(() => {
        loadingState.style.visibility = "hidden";
        currentBalance.style.visibility = "visible";
        currentBalance.classList.add("visible"); // optional: restore if needed
    }, 2000);
});



sendMoney.addEventListener("click" , function(){
    senderForm.style.display = "block";
    sendMoney.style.display = "none";

});


senderForm.addEventListener("submit" , function(event){
    event.preventDefault();

    
    let receiver = {
        receiverName : event.target.receiverName.value,
        receiverEmail : event.target.receiverEmail.value,
        receiverAmount : parseFloat(event.target.receiverAmount.value),
    };

    let receiverEmail = event.target.receiverEmail.value;
    if(receiverEmail === currentUser.email){
        alert("you can not send money to your self !");
        return;
    }

    let existsReceiver = registeredUsers.find((user) => user.email === receiver.receiverEmail);
    if(!existsReceiver){
        alert("user not found !");
    }else{



        let balance = parseFloat(currentBalance.textContent);

        if(receiver.receiverAmount > balance){
            alert("inssufficient balance to send !")
            return;
        }

        balance -= receiver.receiverAmount;
let senderPrevBalance = currentBalance.textContent;
currentBalance.textContent = balance.toFixed(2);





userDetails.push({
    senderName : currentUser.name, 
    userKey: currentUser.email,
    type: "send",
    to: receiver.receiverEmail,
     receiverName: receiver.receiverName,
    amount: receiver.receiverAmount,
    currentBalance: senderPrevBalance,
    updatedBalance: balance.toFixed(2),
});



   

let lastReceiverTxn = userDetails.filter(txn => txn.userKey === receiverEmail).pop();
let receiverPrevBalance = lastReceiverTxn ? parseFloat(lastReceiverTxn.updatedBalance) : 0;
let receiverNewBalance = receiverPrevBalance + receiver.receiverAmount;


userDetails.push({
    senderName: currentUser.name,
    receiverName: receiver.receiverName,
    userKey: receiver.receiverEmail,
    type: "receive",
    from: currentUser.email,
    amount: receiver.receiverAmount,
    currentBalance: receiverPrevBalance.toFixed(2),
    updatedBalance: receiverNewBalance.toFixed(2),
});

localStorage.setItem("userDetails", JSON.stringify(userDetails));
alert("Money sent successfully!");
renderTransactionHistory();

    }

    event.target.reset();
    console.log(receiver);
    sendMoney.style.display = "block";
senderForm.style.display = "none";


       
transactionHistory();

})

logoutBtn.addEventListener("click" , function(){
    localStorage.removeItem("currentUser");
    window.location.href = "../../index.html";
    
})

hideBalance.addEventListener("click" , function(){
    if(currentBalance.classList.contains("visible")){
          currentBalance.classList.remove("visible");
        currentBalance.classList.add("invisible");
        // currentBalance.style.visibility = "hidden";
        // currentBalance.setAttribute("class" , "hidden");
        // currentBalance.innerText = "..........";
        hideBalance.innerHTML = `<i class="fa-solid fa-eye"></i>`;
        hideShowToggleText.innerText = "show balance";
    }else{
           currentBalance.classList.remove("invisible");
        currentBalance.classList.add("visible")
        // currentBalance.style.visibility = "visible";
        // currentBalance.setAttribute("class" , "visible")
        hideBalance.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
        hideShowToggleText.innerText = "hide balance";

    }
});




deactivateAccount.addEventListener("click", function () {
    let confirmDeactivate = confirm("Are you sure you want to deactivate your account?");
    if (!confirmDeactivate) return;

    // Filter out all transactions of the current user
    userDetails = userDetails.filter((txn) => txn.userKey !== currentUser.email);

    // Remove current user session
    localStorage.removeItem("currentUser");

    // Update localStorage with remaining users
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    // Redirect to homepage or login page
    window.location.href = "../../index.html";
});

function renderTransactionHistory() {
    transactionuserName.textContent = ` transaction history `;
    transactionHistoryList.innerHTML = ""; // Clear previous list
    let userTxns = userDetails.filter(txn => txn.userKey === currentUser.email);
    let count = 1;

    userTxns.forEach(txn => {
        let li = document.createElement("li");
            li.classList.add("transictionListCss"); 

        if (txn.type === "deposit") {
            li.innerText = `${count}. current Balance : ${txn.currentBalance} Deposited amount: ${txn.depositamount} | New Balance: ${txn.updatedBalance}`;
            li.style.color = "green";
        } else if (txn.type === "withdraw") {
            li.innerText = `${count}.  current Balance : ${txn.currentBalance} Withdraw amount: ${txn.withDrawAmount} | New Balance: ${txn.updatedBalance}`;
            li.style.color = "red";
        }
        else if (txn.type === "send") {
            li.innerText = `${count}. Sent: ${txn.amount} to ${txn.receiverName} | Previous Balance: ${txn.currentBalance} | New Balance: ${txn.updatedBalance}`;
            li.style.color = "orange";
        } else if (txn.type === "receive") {
            li.innerText = `${count}. Received: ${txn.amount} from ${txn.senderName} | Previous Balance: ${txn.currentBalance} | New Balance: ${txn.updatedBalance}`;
            li.style.color = "white";
        }

        transactionHistoryList.appendChild(li);
        count++;
    });
}



// function transactionHistory(){

//         let userTxns = userDetails.filter(txn => txn.userKey === currentUser.email);
//         let count = 1;

//             userTxns.forEach((user) =>{
//                   let li = document.createElement("li");
//             li.classList.add("transictionListCss"); 

//             if(user.type === "send"){
//                 li.innerText = `${count}. Sent: ${user.amount} to ${user.to} | Previous Balance: ${user.currentBalance} | New Balance: ${user.updatedBalance}`;
//               li.style.color = "orange";
//                }else if(user.type === "receive"){
//                 li.innerText = `${count}. Received: ${user.amount} from ${user.from} | Previous Balance: ${user.currentBalance} | New Balance: ${user.updatedBalance}`;
//             li.style.color = "blue";
//                }

//                transactionHistory.appendChild(li);
//                count++;
//             })
// };


viewAccountDetails.addEventListener("click" , function(){
     let userProfile = document.getElementById("user-profile-details");
    userProfile.innerHTML = ""; // clear previous data
    userProfile.style.display = "block";
  userDetailsHeading.style.display = "block";
 userDetailsHide.style.display = "block";
    let li = document.createElement("li");
    li.classList.add("userDetailsListCss");
    li.innerText = `User Name: ${currentUser.name}
                    User Email: ${currentUser.email}`;

    userProfile.appendChild(li);
});

userDetailsHide.addEventListener("click" , function(){
         let userProfile = document.getElementById("user-profile-details");
         userProfile.style.display = "none";
           userDetailsHeading.style.display = "none";
 userDetailsHide.style.display = "none";


})





withDraw.addEventListener("click" , function(){
    let withDrawAmount = parseFloat(withDrawInput.value);
    let balance = parseFloat(currentBalance.textContent);

    
    if(isNaN(withDrawAmount) || withDrawAmount <= 0){
        alert("enter a valid amount to with draw !");
        return;
    }
    
    if(withDrawAmount > balance){
        alert("insufficient balance !");
        return;
    }else{
        
        currentBalance.style.display = "none";
        loadingState.style.display = "block";
        setTimeout(() => {
          currentBalance.style.display = "block";
          balance -= withDrawAmount;
          currentAmount = currentBalance.textContent,
          currentBalance.textContent = balance;
          withDrawInput.value = "";
          let transaction = {
        userKey : currentUser.email,
     type : "withdraw",
        withDrawAmount : withDrawAmount,
        currentBalance : currentAmount,
        updatedBalance : balance,
    // date: new Date().toISOString(),
};
userDetails.push(transaction);

localStorage.setItem("userDetails" , JSON.stringify(userDetails));
        loadingState.style.display = "none";
        renderTransactionHistory();
        }, 2000);

    //     let transactionList = document.createElement("li");

    //     transactionList.innerText = `${transaction.currentBalance} ${transaction.withDrawAmount}`
    //     transactionHistoryList.appendChild(transactionList);
    }
});

let depositInput = document.getElementById("deposit-input");

deposit.addEventListener("click" , function(){
    let depositAmount = parseFloat(depositInput.value);
    let balance = parseFloat(currentBalance.textContent);
    
    if(depositAmount > 0){
        loadingState.style.display = "block";
                currentBalance.style.display = "none";
        setTimeout(() => {
            balance += depositAmount;
        currentAmount = currentBalance.textContent,
        currentBalance.textContent = balance;
        depositInput.value = "";

         let transaction = {
        userKey : currentUser.email,
        type : "deposit",
        depositamount : depositAmount,
        currentBalance : currentAmount,
        updatedBalance : balance,

    };
    userDetails.push(transaction);
    localStorage.setItem("userDetails" , JSON.stringify(userDetails));
    loadingState.style.display = "none";
            currentBalance.style.display = "block";
        renderTransactionHistory();
        }, 2000);
    }else{
        alert("enter a valid amount to deposit !");
    }

   
})

window.addEventListener("DOMContentLoaded", function () {
    if(currentUser){
        currentUserName.textContent = `welcome ${currentUser.name}`;
    }
 let userTxns = userDetails.filter(txn => txn.userKey === currentUser.email);
  if (userTxns.length > 0) {
    currentBalance.textContent = Number(userTxns[userTxns.length - 1].updatedBalance).toFixed(2);
  }
   else {
    currentBalance.textContent = "0.00";
  }

renderTransactionHistory();
// Render transaction history
    // transactionHistoryList.innerHTML = ""; // Clear old entries (if any)
    // let count = 1;
    // userTxns.forEach(txn => {
    //     let li = document.createElement("li");
    //     if (txn.type === "deposit") {
    //         li.innerText = ` ${count++} .  Deposited: ${txn.depositamount} | Balance: ${txn.updatedBalance}`;
    //         li.style.color = "green";
    //         li.setAttribute("class" , "transictionListCss");
    //     } else if (txn.type === "withdraw") {
    //         li.innerText = ` ${count++} . Withdrew: ${txn.withDrawAmount} | Balance: ${txn.updatedBalance}`;
    //         li.style.color = "red";
    //         li.setAttribute("class" , "transictionListCss");
    //     }
    //     transactionHistoryList.appendChild(li);
    // });


});






