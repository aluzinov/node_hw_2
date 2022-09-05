import * as fs from 'fs';
import * as path from 'path';
import { getDataDir, saveList } from './saveList.js';
import { createNumberReader } from './readNumber.js'

const chunkReg = /chunk_(\d)/
const listChunks = async () => {
  const files = await fs.promises.readdir(getDataDir())
  return files.filter((file) => chunkReg.test(file))
}

const currentValues = []

const getMin = (list) => {
  let result = undefined
  list.forEach(element => {
    if (element != undefined && !isNaN(element)) {
      if (result == undefined) {
        result = element
      } else {
        result = Math.min(result, element)
      }
    }
  });
  return result
}

async function* mergedList() {
  const chunkFiles = await listChunks()
  const numberReaders = chunkFiles.map((chunk) => createNumberReader(chunk)())
  for await (const reader of numberReaders) {
    const next = await reader.next()
    const value = next.value
    currentValues.push(value)
  }

  let min = undefined
  do {
    min = getMin(currentValues)
    if (min != undefined) {
      const minIndex = currentValues.indexOf(min)
      const next = await numberReaders[minIndex].next()
      currentValues[minIndex] = next.value
      yield min
    }
  } while(min != undefined)
}

saveList(mergedList(), 'sorted.txt')