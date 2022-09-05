import * as fs from 'fs';
import * as path from 'path';
import { getDataDir, NUM_SEPARATOR } from './saveList.js';

export const createNumberReader = (fileName) => {
  const filePath = path.resolve(getDataDir(), fileName)
  console.log(`reading '${filePath}'`)
  const rs = fs.createReadStream(filePath, {
    encoding: 'utf8',
  })

  async function* readNumber() {
    for await (const chunk of rs) {
      const numbers = chunk.split(NUM_SEPARATOR)
        
      for await (const num of numbers) {
        yield Number(num)
      }
    }
  }

  return readNumber
}