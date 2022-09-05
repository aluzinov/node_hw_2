import { create } from './createList.js'
import { splitAndSort } from './sortSplit.js'
import { mergeSorted } from './mergeFiles.js'

export const max_total_bytes = 1048576// 00

const DATA_FILE = 'data.txt'
const RESULT_FILE = 'sorted.txt'
const main = async () => {
  await create(DATA_FILE, max_total_bytes)
  const fileNames = await splitAndSort(DATA_FILE)
  await mergeSorted(fileNames, RESULT_FILE)
}

main()