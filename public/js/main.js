import {joinFunc, startFunc} from '/js/module.js';
import {loginFunc} from '/js/login.js'

window.join = joinFunc
window.start = startFunc
window.login = loginFunc

function joinMeeting()
{
    window.join();
}

function startMeeting()
{
    window.start();
}

function login()
{
    window.login();
}

document.querySelector('#JoinButton').addEventListener('click', joinMeeting);
document.querySelector('#StartButton').addEventListener('click', startMeeting);
document.querySelector('#LogInButton').addEventListener('click', login);

