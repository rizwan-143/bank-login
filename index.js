


let loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit" , function(event){
    event.preventDefault();

    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    let loginEmail = event.target.loginEmail.value;
    let loginPassword = event.target.loginPassword.value;


    let findUser = registeredUsers.find(user =>  user.email === loginEmail && user.password === loginPassword );
    if(findUser){

        localStorage.setItem("currentUser" , JSON.stringify(findUser));

        window.location.href = "./html/pages/home.html";
    }else{
        alert("invalid details !");
    }

    event.target.reset();
    
})