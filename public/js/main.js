import {joinFunc} from '/js/module.js';
import {loginFunc} from '/js/login.js'

window.join = joinFunc
window.login = loginFunc

function joinMeeting()
{
    window.join();
}

function login()
{
    window.login();
}

document.querySelector('#JoinButton').addEventListener('click', joinMeeting);
document.querySelector('#LogInButton').addEventListener('click', login);

