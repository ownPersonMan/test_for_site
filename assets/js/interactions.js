document.addEventListener('mouseover', function(event) {
    if (event.target.tagName.toLowerCase() === 'section') {
        event.target.style.transform = 'scale(1.05)';
    }
});

document.addEventListener('focusout', function(event) {
    if (event.target.tagName.toLowerCase() === 'section') {
        event.target.style.transform = 'scale(1)';
    }
});