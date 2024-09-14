import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore,
     collection, 
     addDoc, 
     deleteDoc,
      doc, 
      getDocs,
       updateDoc
 } 
 from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBAJ8cROYtvO_ol4lYETQPpdlsErKddyWE",
    authDomain: "project-login-1b1ff.firebaseapp.com",
    projectId: "project-login-1b1ff",
    storageBucket: "project-login-1b1ff.appspot.com",
    messagingSenderId: "921680755857",
    appId: "1:921680755857:web:5cd525643e6bff98845330",
    measurementId: "G-WL79XD64W8"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const loader = document.getElementById('loader');

const tasksCollection = collection(db, 'tasks');

function showLoader() {
    loader.style.display = 'block';
}

function hideLoader() {
    loader.style.display = 'none';
}

async function renderTasks() {
    showLoader();
    taskList.innerHTML = '';
    const querySnapshot = await getDocs(tasksCollection);
    querySnapshot.forEach((doc) => {
        const task = doc.data();
        const li = document.createElement('li');
        li.textContent = task.name;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', async () => {
            const newName = prompt('Enter new task name:', task.name);
            if (newName) {
                showLoader();
                await updateDoc(doc.ref, { name: newName });
                renderTasks();
            }
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', async () => {
            showLoader();
            await deleteDoc(doc.ref);
            renderTasks();
        });

        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });
    hideLoader();
}

addTaskBtn.addEventListener('click', async () => {
    const taskName = taskInput.value.trim();
    if (taskName) {
        showLoader();
        await addDoc(tasksCollection, { name: taskName });
        taskInput.value = '';
        renderTasks();
    }
});

renderTasks();
