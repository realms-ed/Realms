import {joinFunc} from '/js/module.js';
window.join = joinFunc

function hello()
{
    console.log(window.join());
}
document.querySelector('#JoinButton').addEventListener('click', hello);
