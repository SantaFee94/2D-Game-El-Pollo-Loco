window.init = function init() {
  const canvas = document.getElementById('canvas');
  if (!window.keyboard) window.keyboard = new GameKeyboard();
  window.world = new World(canvas, window.keyboard);
};


