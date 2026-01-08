export function generateRandomName(length) {
  let name = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const charsLength = chars.length;
  for(let i=0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random()* charsLength));
  }
  return name
}