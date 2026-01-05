const playSound = (path, volume = 0.4) => {
  if (!path) {
    return;
  }

  const sound = new Audio(path);
  sound.volume = Math.max(0, Math.min(1, volume));
  sound.currentTime = 0;
  sound.play().catch(() => {}); // ошибка проигнорирована
};

export { playSound };

// Пример использования:
// playSound('assets/audio/modal.mp3', 0.4);
