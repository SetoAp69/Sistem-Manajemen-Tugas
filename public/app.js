
import {getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,browserSessionPersistence,onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";





const firebaseConfig = {
    databaseURL:"https://manajemen-tugas-65563-default-rtdb.asia-southeast1.firebasedatabase.app/",
    apiKey: "AIzaSyDjHUl4Bdc_37BxICfsCrTqbIIJFBeMFKM",
};
const app = initializeApp(firebaseConfig);




if(document.getElementById('index')){
    const auth=getAuth()

    onAuthStateChanged(auth,function(user){
        if(user){
            console.log(user.uid);
        }else{
            console.log('not logged in yet');
            window.location.href='login.html';
        }
    })
}

function logOut(){
    const auth = getAuth();
    signOut(auth).then(()=>{
        window.location.href('login.html')
    }).catch((error)=>{
        console.log(error.message)
    });

}

  
function emailAndPassLogin(email1,password1){
    const email=email1;
    const password=password1;
    const auth=getAuth();
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user=userCredential.user;
        window.location.href='index.html'
    })
    .catch((error)=>{
        const errorCode=error.code;
        const errorMessage=error.message;
    });
}

// document.addEventListener("DOMContentLoaded", event=>{
//     const app =firebase.app();
//     console.log(app)
// });

export function checkAuth(){
    const auth=getAuth();
    console.log(auth);
    if(!auth){
        window.location.href('login.html')
    }
}

function loginWithEmail(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then(result=>{
        const user=result.user;
        initUserData(user);
        console.log(typeof(user.uid));
    })
    .catch(console.log);


}

function initUserData(userId){
    console.log(userId.uid);
    console.log(typeof(userId));
    const uid=JSON.stringify(userId.uid);
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    console.log(uid);
    console.log(typeof(uid));
    set(ref(db, 'users/'+userId.uid+'/task/taskNull'),{
        taskname:'null',
        deadline:'null'
    });
}

function addNewTask(id,name,dl){
    const taskId=id;
    const taskName=name;
    const deadline=dl;
    const auth=getAuth();
    const user=auth.currentUser;
    const app = initializeApp(firebaseConfig);
    const db=getDatabase();
    if(user){
        set(ref(db, 'users/'+user.uid+'/task/'+taskId),{
            taskName : taskName,
            deadline : deadline,
        });
    }


}


export function registerUsingEmailAndPassword(email,password){
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        const user = userCredential.user;
    })
    .catch((error)=>{
        const errorCode=error.code;
        const errorMessage=error.message;
        console.log(errorMessage);
    })
}

if(document.getElementById('registrationForm')){
    document.getElementById('registrationForm').addEventListener('submit',function(event){
        event.preventDefault();
         const name = document.getElementById('name').value;
         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;
    
         registerUsingEmailAndPassword(email,password);
    
     })
}

if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit',function(event){
        event.preventDefault();
         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;
    
         emailAndPassLogin(email,password);
    
     })
}
if(document.getElementById('btn-logout')){
    document.getElementById('btn-logout').addEventListener('click',function(event){
        event.preventDefault();
         
    
         logOut();
    
     })
}



document.addEventListener("DOMContentLoaded", event => {
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.addEventListener("click", loginWithEmail);
    }
  });

document.addEventListener("DOMContentLoaded", event=>{
    const addTaskButton = document.getElementById('btn-addTask');
    if(addTaskButton){
        addTaskButton.addEventListener("click", function(event){
            event.preventDefault();
            window.location.href='addTask.html'
        });
    }
})

document.addEventListener("DOMContentLoaded", event=>{
    const addTaskButton = document.getElementById('btn-goToRegister');
    if(addTaskButton){
        addTaskButton.addEventListener("click", function(event){
            event.preventDefault();
            window.location.href='register.html'
        });
    }
})

document.addEventListener("DOMContentLoaded", event => {
    const register = document.getElementById("registerButton");
    if (register) {
      register.addEventListener('click', function(event){
        event.preventDefault();
        window.location.href='register.html'
      })
    }
})


if(document.getElementById('taskForm')){
    document.getElementById('taskForm').addEventListener('submit',function(event){
        event.preventDefault();
         const taskId = document.getElementById('taskId').value;
         const name = document.getElementById('taskName').value;
         const deadline = document.getElementById('deadline').value;

    
         addNewTask(taskId,name,deadline);

         console.log('new task');
         window.location.href('index.html');
    
     })
}

document.addEventListener("DOMContentLoaded",function(){
    checkAuth();
})