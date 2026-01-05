/**
 * Форматирует дату в формат DD.MM.YYYY (или с другим разделителем)
 * @param {Date|string|number} date - Дата для форматирования
 * @param {string} separator - Разделитель между днём, месяцем и годом (по умолчанию '.')
 * @returns {string} Отформатированная дата или пустая строка при ошибке
 */
export function formatDate(date, separator = '.') {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    console.error('formatDate: Некорректная дата -', date);
    return '';
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}${separator}${month}${separator}${year}`;
}
