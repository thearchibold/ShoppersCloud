/**
 * Created by archibold on 27/07/2018.
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getFirstLetter(value) {
    return value.charAt(0)
}

export {getRandomColor, getFirstLetter}