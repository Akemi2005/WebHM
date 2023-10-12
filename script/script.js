const red = document.getElementById('red');
const redBtn = document.getElementById('redBtn');
const blue = document.getElementById('blue');
const blueBtn = document.getElementById('blueBtn');
const over = document.getElementById('over');
const main = document.getElementById('main');

redBtn.addEventListener('mouseenter', () => {
    red.classList.remove('hide');
});

redBtn.addEventListener('mouseleave', () => {
    red.classList.add('hide');
});

blueBtn.addEventListener('mouseenter', () => {
    blue.classList.remove('hide');
});

blueBtn.addEventListener('mouseleave', () => {
    blue.classList.add('hide');
});
    
blueBtn.addEventListener('click', () => {
    main.classList.add('hide');
    over.classList.remove('hide');
});

alert('CHOOSE...');
