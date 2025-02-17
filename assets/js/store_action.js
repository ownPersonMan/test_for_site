async function search() {
    const query = document.getElementById('searchInput').value;
    const format = document.getElementById('formatFilter').value;

    if (!query) {
        alert('Введите ключевые слова для поиска');
        return;
    }

    // Показываем прогресс-бар
    const progressBar = document.getElementById('progressBar');
    const progress = progressBar.querySelector('.progress');
    progressBar.style.display = 'block';
    progress.style.width = '0%';

    // Имитация прогресса
    let progressWidth = 0;
    const interval = setInterval(() => {
        progressWidth += 10;
        progress.style.width = `${progressWidth}%`;
        if (progressWidth >= 100) clearInterval(interval);
    }, 200);

    try {
        const response = await fetch(`search.php?q=${query}&format=${format}`);
        const data = await response.json();

        // Останавливаем прогресс-бар
        clearInterval(interval);
        progress.style.width = '100%';
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 500);

        displayResults(data);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        progressBar.style.display = 'none';
        alert('Произошла ошибка при поиске. Попробуйте еще раз.');
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>Ничего не найдено.</p>';
        return;
    }

    data.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        resultsDiv.appendChild(resultItem);
    });
}