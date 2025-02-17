document.addEventListener("DOMContentLoaded", () => {
    const phrases = [
        "Загрузка курсовых работ...",
        "Подготовка материалов...",
        "Компиляция шпаргалок...",
        "Ищем вдохновение...",
        "Подбираем темы..."
    ];

    const loadingTextElement = document.getElementById('loading-text');
    const contentElement = document.getElementById('content');
    let phraseIndex = 0;

    function showRandomPhrase() {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        loadingTextElement.textContent = phrases[phraseIndex];
    }

    // Меняем фразы каждые 4 секунды
    setInterval(showRandomPhrase, 4000);
    showRandomPhrase(); // Показываем первую фразу сразу

    // Показываем контент после 20 секунд
    setTimeout(() => {
        document.querySelector('.preloader-container').style.display = 'none';
        contentElement.style.display = 'block';
    }, 1000);//20000
});