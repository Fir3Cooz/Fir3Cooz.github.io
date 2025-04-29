const icons = document.querySelectorAll('.icons');
const modal = document.getElementById('modal');
const button = document.getElementById('savoirplus');

let activeIcon = null;

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const rect = icon.getBoundingClientRect();
        const alt = icon.querySelector('img').alt;

        // IMPORTANT : Ne jamais toucher à modal.style.top ici
        modal.style.left = `${rect.left - 310}px`; // 300px de modal + 10px de marge
        modal.style.display = (modal.style.display === 'block' && activeIcon === icon) ? 'none' : 'block';
        document.getElementById(alt).style.display = 'block';
        activeIcon = (modal.style.display === 'block') ? icon : null;
    });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.icons') && !event.target.closest('.modal')) {
        modal.style.display = 'none';
        activeIcon = null;
    }
});

button.addEventListener('click', () => {
    const identityIcon = Array.from(icons).find(icon =>
        icon.querySelector('img').alt === 'Identity'
    );
    console.log(identityIcon);
    if (identityIcon) {
        identityIcon.click(); // Simule le clic sur l'icône "Identity"
    }
});

