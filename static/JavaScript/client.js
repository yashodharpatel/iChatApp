const socket = io();

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving messages
let audio = new Audio('../src/sound.mp3');

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight + form.scrollHeight;
    if(position == 'left' || position == 'centre'){
        audio.play();
    }
} 

// Ask new user for his/her name and let the server know
const name = prompt('Enter your name to login');
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name=>{
    append(`${name} JOINED THE CHAT`, 'centre');
});

// If any new user joins, let that user and all other users know no of users connected to the server!
socket.on('clients-connected', clientsCount => {
    if(clientsCount <= 1){
        append(`${clientsCount} participant connected to iChatApp`, 'centre-clientsConnected');
    }
    else{
        append(`${clientsCount} participants connected to iChatApp`, 'centre-clientsConnected');
    }
});

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

// If a user leaves the chat, append the info to the container
socket.on('left', name=>{
    append(`${name} LEFT THE CHAT`, 'centre');
});

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents the page from reload to when the form is submitted
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
    return false;
});

// Prevents the site from leaving or reload
function leavePage() {   
    return "Changes that you made may not be saved.";
}