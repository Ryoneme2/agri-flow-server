import atob from 'atob-lite'
import isBase64 from 'is-base64'

function _base64ToArrayBuffer(base64: string) {
  console.log({ base64 });

  return Buffer.from(base64, 'base64');
}

export function stringToArrayBuffer(arg: string) {
  if (typeof arg !== 'string') throw Error('Argument should be a string')

  //valid data uri
  if (/^data\:/i.test(arg)) return decode(arg)

  //base64
  if (isBase64(arg)) arg = atob(arg)

  return str2ab(arg)
}

export function str2ab(str: string) {
  let array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer
}

function decode(uri: string) {
  // strip newlines
  uri = uri.replace(/\r?\n/g, '');

  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(',');
  if (-1 === firstComma || firstComma <= 4) throw new TypeError('malformed data-URI');

  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(';');

  let base64 = false;
  let charset = 'US-ASCII';
  for (let i = 0; i < meta.length; i++) {
    if ('base64' == meta[i]) {
      base64 = true;
    } else if (0 == meta[i].indexOf('charset=')) {
      charset = meta[i].substring(8);
    }
  }

  // get the encoded data portion and decode URI-encoded chars
  let data = decodeURI(uri.substring(firstComma + 1));

  if (base64) data = atob(data)

  let abuf = str2ab(data)

  Object.assign(abuf, { type: meta[0] || 'text/plain' })
  Object.assign(abuf, { charset: charset })

  return abuf
}

export default _base64ToArrayBuffer