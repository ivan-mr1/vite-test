export default function logger(...args) {
  try {
    console.log(...args);
  } catch (e) {
    // noop
  }
}
