const clear = document.getElementById('clear-distance');
clear.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('lcoation').value = '' ;
    document.querySelector('input[type=radio]:checked').checked = false;
});