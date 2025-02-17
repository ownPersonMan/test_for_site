<?php
// Функция для поиска файлов .docx на сайте
function searchFiles($url, $query) {
    $foundFiles = [];

    // Получаем HTML-код страницы
    $html = file_get_contents($url);
    if ($html === FALSE) {
        return ['error' => 'Не удалось загрузить страницу'];
    }

    // Ищем все ссылки на .docx файлы
    preg_match_all('/<a\s+(?:[^>]*?\s+)?href=(["\'])(.*?\.docx)\1/i', $html, $matches);
    $docxFiles = $matches[2];

    // Проверяем каждый файл на наличие ключевых слов
    foreach ($docxFiles as $fileUrl) {
        // Если ссылка относительная, преобразуем её в абсолютную
        if (strpos($fileUrl, 'http') !== 0) {
            $fileUrl = rtrim($url, '/') . '/' . ltrim($fileUrl, '/');
        }

        // Скачиваем файл
        $fileContent = file_get_contents($fileUrl);
        if ($fileContent === FALSE) {
            continue;
        }

        // Читаем содержимое .docx файла
        $content = readDocx($fileContent);
        if (stripos($content, $query) !== FALSE) {
            $foundFiles[] = [
                'title' => basename($fileUrl),
                'link' => $fileUrl
            ];
        }
    }

    return $foundFiles;
}

// Функция для чтения содержимого .docx файла
function readDocx($fileContent) {
    $zip = new ZipArchive;
    $tempFile = tempnam(sys_get_temp_dir(), 'docx');
    file_put_contents($tempFile, $fileContent);

    if ($zip->open($tempFile) {
        $content = '';
        if (($index = $zip->locateName('word/document.xml')) !== FALSE) {
            $content = $zip->getFromIndex($index);
        }
        $zip->close();
        unlink($tempFile);

        // Удаляем XML-теги и возвращаем текст
        return strip_tags($content);
    }

    return '';
}

// Получаем параметры запроса
$query = $_GET['q'] ?? '';
$format_filter = $_GET['format'] ?? 'all';

if (empty($query)) {
    http_response_code(400);
    echo json_encode(['error' => 'Параметр "q" обязателен']);
    exit;
}

// Указываем сайт для поиска
$siteUrl = 'https://www.academia.edu'; // Замените на нужный сайт

// Ищем файлы
$results = [];
if ($format_filter === 'docx' || $format_filter === 'all') {
    $results = searchFiles($siteUrl, $query);
}

// Возвращаем JSON
header('Content-Type: application/json');
echo json_encode($results);
?>