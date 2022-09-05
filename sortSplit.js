import * as path from 'path';
import * as fs from 'fs';
import { saveList, getDataDir } from './saveList.js';
import { mergeSort } from './mergeSort.js';
import { createNumberReader } from './readNumber.js'

const sortAndSave = async (list, chunkNum) => {
  console.log(`sorting sublist`)
  const sorted = mergeSort(list)
  const fileName = `chunk_${chunkNum}.txt`
  await saveList(sorted, fileName)
  return fileName
}

export const splitAndSort = async (sourceFile) => {
  const filePath = path.resolve(getDataDir(), sourceFile)
  const sourceFileSize = fs.statSync(filePath).size
  const maxChunkSize = sourceFileSize / 5;

  const sortedFiles = []
  let list = []
  let readBytes = 0
  let readBytesTotal = 0
  let first = true
  const numberReader = createNumberReader(sourceFile)()
  for await (const num of numberReader) {
    if (first) {
      first = false
    } else {
      readBytes += 1
    }
    readBytes+=num.toString().length
    list.push(num)
  
    if (readBytes >= maxChunkSize) {
      sortedFiles.push(await sortAndSave(list, sortedFiles.length))
      readBytesTotal+=readBytes
      console.log(`read ${Math.round(readBytesTotal/sourceFileSize * 100)}% of '${sourceFile}'`)
  
      readBytes = 0 
      list = []
    }
  }
  
  // save last
  if (list.length > 0) {
    sortedFiles.push(await sortAndSave(list, sortedFiles.length))
  }

  return sortedFiles
}
