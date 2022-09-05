import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

export const NUM_SEPARATOR = ','

export const getDataDir = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '/data')
}

export const saveList = async (list, fileName) => {
  return new Promise((resolve, reject) => {
  const filePath = path.resolve(getDataDir(), fileName)
  const ws = fs.createWriteStream(filePath, {
    encoding: 'utf8',
    flags: 'w', 
  })
  ws.on('open', async () => {
      console.log(`saving list of ${list.length} elements in file '${filePath}'`)
      try {
        let previous = 0
        let i = 0
        let first = true
        for await (const value of list) {
          const stringValue = value.toString()
          let stringToWrite
          if (first) {
            first = false
            stringToWrite = stringValue
          } else {
            stringToWrite = NUM_SEPARATOR + stringValue
          }
          const promise = write(ws, stringToWrite)
          if (promise) {
              // we got a drain event, therefore we wait
              await promise
          }
          const percent = Math.round((i / list.length) * 100)
          if (percent > previous && percent % 10 === 0) {
            console.log(`saved ${percent}%`)
            previous = percent
          }
          i++
        }

        console.log(`file saved`)
        resolve()
      }
      catch (error) {
        reject(error)
      }
      finally {
        ws.close()
      }
  })
})}

const write = (writer, data) => {
  // return a promise only when we get a drain
  if (!writer.write(data)) {
      return new Promise((resolve) => {
          writer.once('drain', resolve)
      })
  }
}


