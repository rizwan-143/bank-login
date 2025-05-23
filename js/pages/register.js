
let registrationForm = document.getElementById("registrationForm");


registrationForm.addEventListener("submit" , function(event){
    event.preventDefault();
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let registrationEmail = event.target.registrationEmail.value;
    let registrationName = event.target.registrationName.value;
    let registrationCnic = event.target.registrationCnic.value;
    let registrationPassword = event.target.registrationPassword.value;
    console.log(registrationCnic , registrationEmail , registrationName , registrationPassword);

    const existEmail = registeredUsers.find(user =>  user.email === registrationEmail);
    if(existEmail){
        alert("this email is already exists !");
        return;
    };
    const existsCnic = registeredUsers.find(user =>  user.cnic === registrationCnic);
    if(existsCnic){
        alert("this cnic is already exists !");
        return;
    };

    if(registrationPassword.length < 8){
        alert("please enter a strong password !");
        return;
    }

    const newUser ={
        email : registrationEmail,
        name : registrationName,
        cnic : registrationCnic,
        password : registrationPassword,
    };
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers" , JSON.stringify(registeredUsers));
    event.target.reset();
});



