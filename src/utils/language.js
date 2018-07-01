export function mimeToType(mime) {
  switch (mime) {
    case 'text/markdown':
      return 'markdown';
    case 'text/html':
      return 'html';
    case 'application/javascript':
      return 'javascript';
    case 'application/json':
      return 'json';
    case 'text/x-c':
    case 'text/x-cpp':
      return 'c';
    default:
      return 'text';
  }
}