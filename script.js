const icons = document.querySelectorAll('.icons');
const modal = document.getElementById('modal');

let activeIcon = null;

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const rect = icon.getBoundingClientRect();

        // IMPORTANT : Ne jamais toucher à modal.style.top ici
        modal.style.left = `${rect.right + 10}px`; // juste la position horizontale
        modal.style.display = (modal.style.display === 'block' && activeIcon === icon) ? 'none' : 'block';
        modal.querySelector('p').textContent = icon.querySelector('img').alt;
        activeIcon = (modal.style.display === 'block') ? icon : null;
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.icons') && !event.target.closest('.modal')) {
        modal.style.display = 'none';
        activeIcon = null;
    }
});
