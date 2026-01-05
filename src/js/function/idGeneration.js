export const idGeneration = function () {
  return crypto?.randomUUID() ?? Date.now().toString();
};
