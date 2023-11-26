
import {getDatabase, ref, set,onValue,update} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";

import { signInWithPopup, signInWithRedirect,getRedirectResult, GoogleAuthProvider ,getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,browserSessionPersistence,onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
// import * as firebase from'firebase/app';
// import 'firebase/auth'



const firebaseConfig = {
    databaseURL:"https://manajemen-tugas-kuliah-f0645-default-rtdb.asia-southeast1.firebasedatabase.app/",
    apiKey: "AIzaSyDnp3-c04_Hto4YImjdLl_pnZBQ_r-btRM",
    appId: "1:208839786645:web:cb184f000ad012ebfd5b9c",
    authDomain: "manajemen-tugas-kuliah-f0645.firebaseapp.com",
};
const app = initializeApp(firebaseConfig);





if(document.getElementById('index')){
    const auth=getAuth()

    onAuthStateChanged(auth,function(user){
        if(user){
            console.log(user.uid);
            document.getElementById('username').textContent="Hello, \n"+user.displayName
            getTask()
            
            
        }else{
            console.log('not logged in yet');
            window.location.href='login.html';
        }
    })
}



function logOut(){
    const auth = getAuth();
    signOut(auth).then(()=>{
        window.location.href='login.html'
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

// export function checkAuth(){
//     const auth=getAuth();
    
    
//     if(!auth){
//         window.location.href='login.html'
       
//     }else{
//     }
// }

function getTask(){
    const auth=getAuth();
    const user=auth.currentUser;
    let lateTask=[]
    let task=[]
    console.log(user);
    if(user){
        
        const db=getDatabase()
        const refx=ref(db,'users/'+user.uid+'/task/')
        
        onValue(refx, (snapshot)=>{
            const data=snapshot.val()
            
            for(const taskData in data){
                if(new Date(data[taskData].deadline)<new Date()){
                    console.log(new Date(data[taskData].deadline)+'  < '+ new Date())
                    lateTask.push(data[taskData])
                    
                }else{
                    console.log(new Date(data[taskData].deadline)+'  > '+ new Date())
                    task.push(data[taskData])
                    
                }
            
            }
                const taskTable=createTable(task,'Task');
                const lateTaskTable=createTable(lateTask,'Late Task');
                          
                console.log(task)
                console.log(lateTask)
                document.body.appendChild(taskTable)
                document.body.appendChild(lateTaskTable)

        })  
        
        
    }else{
        console.log('user not found')
    }
    
   
    
}

function createTable(tableData,tableName){
    const table=document.createElement('table')
    table.setAttribute('id','table')
    const tableBody=document.createElement('tbody')
    tableBody.setAttribute('id','tbody')

    const tableCaption=document.createElement('caption')
    tableCaption.textContent=tableName;
    table.appendChild(tableCaption);
    console.log(tableData);
    tableData.forEach(task=>{
        const row=tableBody.insertRow();
        row.insertCell().textContent=task.taskName;
        row.insertCell().textContent=task.deadline;
        
        const doneButtonCell = row.insertCell();
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done'; // Change text accordingly
        doneButton.setAttribute('data-task-id', task.taskId);
        doneButton.addEventListener('click',function(event){
            event.preventDefault()
            try{
                deleteTask(task.taskId)
                window.location.href='index.html'

            }catch(error){
                console.log(error)
            }
            
        }) // Optionally set data attributes
        doneButtonCell.appendChild(doneButton);

        const editButtonCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit'; // Change text accordingly
        editButton.id='taskEditButton'
        // editButton.setAttribute('href',`editTask.html?taskID=${task.taskId}`)
        editButton.addEventListener('click',function(event){
            event.preventDefault()
            window.location.href=`editTask.html?taskID=${task.taskId}`
        })
        editButton.setAttribute('data-task-id', task.taskId); // Optionally set data attributes
        editButtonCell.appendChild(editButton);

    });
    table.appendChild(tableBody);
    return table;
}

function deleteTask(id){
    const taskId=id
    const auth=getAuth()
    const db=getDatabase()
    onAuthStateChanged(auth,function(user){
        if(user){
            
            const updates={}
            const postData={
                taskName:null,
                deadline:null,
                note:null,
                taskId:null,
            }
            updates['/users/'+user.uid+'/task/'+taskId]=postData
            return update(ref(db),updates)
            
        }
       
    })

}

function loginWithEmail(){
    const app=initializeApp(firebaseConfig)
    const provider = new GoogleAuthProvider();
    const auth=getAuth();

    signInWithPopup(auth,provider)
    .then ((result)=>{
        const credential=GoogleAuthProvider.credentialFromResult(result);
        const token=credential.accessToken;
        const user=result.user;
        if(user){
            window.location.href='index.html'
        }
    }).catch((error)=>{
        console.log(error.message);
    })


    // initializeApp.auth().signInWithPopup(provider)
    // .then(result=>{
    //     const user=result.user;
    //     initUserData(user);
    //     console.log(typeof(user.uid));
    // })
    // .catch(console.log);

    // signInWithRedirect(auth,provider);
    // getRedirectResult(auth)
    // .then((result)=>{
    //     const credential=GoogleAuthProvider.credentialFromResult(result);
    //     const token=credential.accessToken;
    //     const user=result.user;
    //     alert(user.displayName);
    // }).catch((error)=>{
    //     console.log(error.message);
    // })






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

function generateId(){
    const timeStamp=new Date().getTime().toString()
    const taskId='task'+timeStamp
    return taskId
}

function addNewTask(name,dl){
    const taskId=generateId();
    const taskName=name;
    const deadline=dl;
    // const taskNote =note;
    const auth=getAuth();
    const user=auth.currentUser;
    
    const db=getDatabase();
    if(user){
        
             set(ref(db, 'users/'+user.uid+'/task/'+taskId),{
                taskId : taskId,
                taskName : taskName,
                deadline : deadline,
                // note : taskNote,
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



document.addEventListener("DOMContentLoaded", function() {
    const taskData = document.getElementById('task-data');
    if (taskData) {
        // If the element with ID 'task-data' exists, call getTask function
        
    }
});



document.addEventListener("DOMContentLoaded", event => {
    const loginWithEmailButton = document.getElementById("loginWithEmailButton");
    if (loginWithEmailButton) {
      loginWithEmailButton.addEventListener("click", loginWithEmail);
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
         
         const name = document.getElementById('taskName').value;
         const deadline = document.getElementById('deadline').value;
        // const taskNote=document.getElementById('taskNote').value

         addNewTask(name,deadline,);

         
         
    
     })
}

// document.addEventListener("DOMContentLoaded", function() {
//     const taskForm = document.getElementById('taskForm');
//     let index=0;
//     if (taskForm) {
//         console.log('task form loaded')
//         taskForm.addEventListener('submit', function(event) {
//             event.preventDefault();
//             const name = document.getElementById('taskName').value;
//             const deadline = document.getElementById('deadline').value;
//             const taskNote = document.getElementById('taskNote').value;

//             addNewTask(name, deadline, taskNote);
            
//             index++;
            
            
//         })
        
//     }

    
    
    
// });





   


    

 

document.addEventListener("DOMContentLoaded", function() {
    const taskEditForm = document.getElementById('taskEditForm');
    if(taskEditForm){
        console.log('form loaded')
        const app=initializeApp(firebaseConfig)
        const queryString=window.location.search
        const taskNameForm = document.getElementById('taskName');
        const deadlineForm = document.getElementById('deadline');
        const urlParams = new URLSearchParams(queryString);
        const taskId=urlParams.get('taskID');
        
        
        if(taskId){
            const auth=getAuth();
            onAuthStateChanged(auth,function(user){
                if(user){
                    console.log(user)
                    const db=getDatabase()
                    const refx=ref(db,'users/'+user.uid+'/task/'+taskId)
                    
                    onValue(refx, (snapshot)=>{
                        const data=snapshot.val()
                        taskNameForm.value=data.taskName;
                        deadlineForm.value=data.deadline;
            
                    })  

                    document.getElementById('editSubmit').addEventListener('click',function(event){
                        
                        const updates={};
                        const postData={
                            taskName:taskNameForm.value,
                            deadline:deadlineForm.value,
                        }
                        updates['/users/'+user.uid+'/task/'+taskId]=postData
                        return update(ref(db),updates)
                    })
                }else{
                    console.log('user not found')
                }
            })

           
            
        }
    } else {
        console.log('not loaded')
    }
});
