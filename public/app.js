
import {getDatabase, ref, set,onValue,update} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { signInWithPopup, signInWithRedirect,getRedirectResult, GoogleAuthProvider ,getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,browserSessionPersistence,onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
// import * as firebase from'firebase/app';
// import 'firebase/auth'



const firebaseConfig = {
    
    apiKey: "AIzaSyCZrmaOteLfgQe3Z7PHq4PAjOE_Y49DmMw",
  authDomain: "sistem-manajemen-tugas-k-4c462.firebaseapp.com",
  projectId: "sistem-manajemen-tugas-k-4c462",
  storageBucket: "sistem-manajemen-tugas-k-4c462.appspot.com",
  messagingSenderId: "321281160990",
  appId: "1:321281160990:web:38e5bd1f7f823aff8f7b0f",
  databaseURL:"https://sistem-manajemen-tugas-k-4c462-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
const app = initializeApp(firebaseConfig);


const auth = getAuth();




document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById('userDropdown');
    const loginOption = document.getElementById('loginOption');
    const registerOption = document.getElementById('registerOption');
    const logoutOption = document.getElementById('logoutOption');
    const auth = getAuth();

    if (window.location.pathname.includes('manajemenTask.html')) {
        const auth = getAuth();
    
        onAuthStateChanged(auth, function (user) {
            if (user) {
                // User is authenticated
                console.log('User is logged in:', user.uid);
                document.getElementById('username').textContent = "Hello, \n" + user.displayName;
                const logoutButton = document.createElement('button');
                logoutButton.textContent = 'Logout';
                logoutButton.id = 'btn-logout';
                const navbar=document.getElementById('logout-container')
                navbar.appendChild(logoutButton)

                
            } else {
                // User is not authenticated
                console.log('User is not logged in yet');
    
                // Redirect to login.html if not already on the login page
                if (window.location.pathname !== '/login.html') {
                    window.location.href = 'login.html';
                }
            }
        });
    }
    if(document.getElementById('btn-logout')){
        document.getElementById('btn-logout').addEventListener('click',logOut)
    }

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            emailAndPassLogin(email, password);
        });
    }

    const linkGoToRegister = document.getElementById('link-goToRegister');
    if (linkGoToRegister) {
        linkGoToRegister.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = 'register.html';
        });
    }

    const googleSignInButton = document.getElementById('googleSignInButton');
    if (googleSignInButton) {
        googleSignInButton.addEventListener("click", loginWithEmail);
    }
  
    onAuthStateChanged(auth, function (user) {
        console.log('User state changed:', user);
  
        if (user) {
            // User is authenticated
            console.log('User is logged in:', user.email);
            if (userDropdown) {
                userDropdown.querySelector('.dropbtn').textContent = user.email;
            }
            if (loginOption) {
                loginOption.style.display = 'none';
            }
            if (registerOption) {
                registerOption.style.display = 'none';
            }
            if (logoutOption) {
                logoutOption.style.display = 'block';
            }
            getTask(); 
        } else {
            // User is not authenticated
            console.log('User is logged out');
            if (userDropdown) {
                userDropdown.querySelector('.dropbtn').textContent = 'User';
            }
            if (loginOption) {
                loginOption.style.display = 'block';
            }
            if (registerOption) {
                registerOption.style.display = 'block';
            }
            if (logoutOption) {
                logoutOption.style.display = 'none';
            }
        }
    });
  
    if (logoutOption) {
        logoutOption.addEventListener('click', function (event) {
            event.preventDefault();
            logOut();
        });
    }
});


function logOut(){
    const auth = getAuth();
    console.log('logout')

    signOut(auth).then(()=>{
        window.location.href='index.html'
        console.log('logout')
    }).catch((error)=>{
        console.log(error.message)
    });

}

  
function emailAndPassLogin(email1, password1) {
    const email = email1;
    const password = password1;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Redirect after successful login
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
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

function getTask() {
    const auth = getAuth();
    const user = auth.currentUser;
    let lateTask = [];
    let task = [];

    if (user) {
        const db = getDatabase();
        const refx = ref(db, 'users/' + user.uid + '/task/');

        onValue(refx, (snapshot) => {
            const data = snapshot.val();
            let dataToBeSort=[];
            // Clear existing tables
            const leftTableContainer = document.getElementById('left-table');
            const rightTableContainer = document.getElementById('right-table');
            leftTableContainer.innerHTML = '';
            rightTableContainer.innerHTML = '';

            // for (const taskData in data) {
            //     if (new Date(data[taskData].deadline) < new Date()) {
            //         console.log(new Date(data[taskData].deadline) + '  < ' + new Date());
            //         lateTask.push(data[taskData]);
            //     } else {
            //         console.log(new Date(data[taskData].deadline) + '  > ' + new Date());
            //         task.push(data[taskData]);
            //     }
            // }

            for (const taskData in data){
                dataToBeSort.push(data[taskData])
            }
            dataToBeSort.sort(compareDate);

            dataToBeSort.forEach((data)=>{
                if(new Date (data.deadline)<new Date()){
                    lateTask.push(data)
                }else{
                    task.push(data)
                }
            })



            const leftTable = createTable(task);
            const rightTable = createTable(lateTask);

            leftTableContainer.appendChild(leftTable);
            rightTableContainer.appendChild(rightTable);
        });
    } else {
        console.log('user not found');
    }
}

function compareDate(a,b){
    if(new Date(a.deadline)==null){
        return new Date(a.deadline)-new Date(b.deadline)
    }
    else if(new Date(b.deadline==null)){
        return new Date(a.deadline)-new Date(b.deadline)
    }
    else{
        return new Date(b.deadline)-new Date(a.deadline)
    }
}

  function createTable(tableData, tableName) {
    const table = document.createElement('table');
    table.setAttribute('class', 'table table-striped table-hover');

    const thead = document.createElement('thead');
    const headerRow = thead.insertRow();

    // Create the header cells
    const headers = ['No', 'Nama Tugas', 'Deadline', 'Done', 'Edit'];
    headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const tableCaption = document.createElement('caption');
    tableCaption.textContent = tableName;
    table.appendChild(tableCaption);

    let counter = 1;

    tableData.forEach((task) => {
        const row = tbody.insertRow();

        const counterCell = row.insertCell();
        counterCell.textContent = counter++;

        row.insertCell().textContent = task.taskName;
        row.insertCell().textContent = task.deadline;

        const doneButtonCell = row.insertCell();
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.setAttribute('data-task-id', task.taskId);
        doneButton.setAttribute('class', 'btn btn-success');
        doneButton.addEventListener('click', function (event) {
            event.preventDefault();
            try {
                deleteTask(task.taskId);
                window.location.href = 'manajemenTask.html';
            } catch (error) {
                console.log(error);
            }
        });
        doneButtonCell.appendChild(doneButton);

        const editButtonCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.id = 'taskEditButton';
        editButton.setAttribute('class', 'btn btn-warning'); // Bootstrap styling
        editButton.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = `editTask.html?taskID=${task.taskId}`;
        });
        editButton.setAttribute('data-task-id', task.taskId);
        editButtonCell.appendChild(editButton);
    });

    return table;
}

function deleteTask(id) {
    const taskId = id;
    const auth = getAuth();
    const db = getDatabase();

    onAuthStateChanged(auth, function (user) {
        if (user) {
            const updates = {};
            updates['/users/' + user.uid + '/task/' + taskId] = null;

            update(ref(db), updates).then(() => {
                // Task successfully deleted
                console.log('Task deleted successfully');
                getTask(); // Refresh the table after deletion
            }).catch((error) => {
                console.log(error.message);
            });
        }
    });
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
        window.location.href='login.html'
    })
    .catch((error)=>{
        const errorCode=error.code;
        const errorMessage=error.message;
        console.log(errorMessage);
        console.log(errorCode);

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

         window.location.href = 'manajemenTask.html';
         
    
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





   


    

 
document.addEventListener("DOMContentLoaded", function () {
    const taskEditForm = document.getElementById('taskEditForm');
    if (taskEditForm) {
        console.log('form loaded');
        const app = initializeApp(firebaseConfig);
        const queryString = window.location.search;
        const taskNameForm = document.getElementById('taskName');
        const deadlineForm = document.getElementById('deadline');
        const urlParams = new URLSearchParams(queryString);
        const taskId = urlParams.get('taskID');

        if (taskId === null) {
            getTask();
            window.location.href = 'manajemenTask.html';
        }

        if (taskId) {
            const auth = getAuth();
            onAuthStateChanged(auth, function (user) {
                if (user) {
                    console.log(user);
                    const db = getDatabase();
                    const refx = ref(db, 'users/' + user.uid + '/task/' + taskId);

                    onValue(refx, (snapshot) => {
                        const data = snapshot.val();
                        taskNameForm.value = data.taskName;
                        deadlineForm.value = data.deadline;
                    });

                    document.getElementById('editSubmit').addEventListener('click', function (event) {
                        const updates = {};

                        const postData = {
                            taskName: taskNameForm.value,
                            deadline: deadlineForm.value,
                            taskId
                        };

                        updates['/users/' + user.uid + '/task/' + taskId] = postData;

                        update(ref(db), updates).then(() => {
                            console.log('Update successful');
                            // Refresh the table after a successful update
                            getTask();
                            window.location.href = 'manajemenTask.html'; // Redirect after successful update
                        }).catch((error) => {
                            console.log(error.message);
                        });

                        event.preventDefault();
                    });
                } else {
                    console.log('user not found');
                }
            });
        } else {
            console.log('Task ID not found in URL parameters');
        }
    } else {
        console.log('Form not loaded');
    }
});