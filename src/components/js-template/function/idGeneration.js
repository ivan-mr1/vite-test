const idGeneration = function () {
  return crypto?.randomUUID() ?? Date.now().toString();
};

export default idGeneration;
