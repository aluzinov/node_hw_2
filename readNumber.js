import * as fs from 'fs';
import * as path from 'path';
import { getDataDir, NUM_SEPARATOR } from './saveList.js';

const findCompleteChunk = (chunk) => {
  let i = chunk.length - 1
  for (i = chunk.length - 1; i > 0; i--) {
    if (chunk[i] == NUM_SEPARATOR) {
      break;
    }
  }

  const result = chunk.slice(0, i)
  const tail = chunk.slice(i + 1)
  return [result, tail]
}

export const createNumberReader = (fileName) => {
  const filePath = path.resolve(getDataDir(), fileName)
  console.log(`reading '${filePath}'`)
  const rs = fs.createReadStream(filePath, {
    encoding: 'utf8',
  })

  async function* readNumber() {
    let prev = ""
    for await (const chunk of rs) {
      const [left, right] = findCompleteChunk(chunk)
      let completeChunk = prev + left
      prev = right

      const numbers = completeChunk.split(NUM_SEPARATOR)
        
      for await (const num of numbers) {
        yield Number(num)
      }
    }

    if (prev) {
      yield Number(prev)
    }
  }

  return readNumber
}