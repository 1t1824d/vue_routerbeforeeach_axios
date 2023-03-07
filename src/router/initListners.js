/**
 * Инициализация слушателей событий роутера
 * 
 * @param {Router} router Роутер приложения
 * @param  {...any} listners Слушатели
 */

export default function initListners(router, ...listners) {
  console.log("listners", listners)
  console.log("listners.flat()", listners.flat())
  return router;
};
