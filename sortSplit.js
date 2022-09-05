import { saveList } from './saveList.js';
import { mergeSort } from './mergeSort.js';
import { createNumberReader } from './readNumber.js'

const max = 20971520
const max_total = 104857600

let count = 0
let total = 0
let fileCount = 0

const saveSorted = async (list) => {
  total+=count
  console.log(`read ${Math.round(total/max_total * 100)}%`)
  console.log(`soring sublist`)
  const sorted = mergeSort(list)
  await saveList(sorted, `chunk_${fileCount++}.txt`)
}

let list = []
const numberReader = createNumberReader('data.txt')()
for await (const num of numberReader) {
  list.push(num)
  count+=num.toString().length + 1

  if (count >= max) {     
    await saveSorted(list)

    count = 0 
    list = []
  }
}

// save last
saveSorted(list)