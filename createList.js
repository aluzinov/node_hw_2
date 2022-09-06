import { saveList } from "./saveList.js";

const createList = (max_bytes) => {
  let count_bytes = 0

  return function* () {
    while (count_bytes < max_bytes){
      const value = Math.round(Math.random() * 10000)
      yield value
      count_bytes+=value.toString().length + 1
    }
  }
}

export const create = async (fileName, max_total_bytes) => {
  const list = createList(max_total_bytes)()
  await saveList(list, fileName)
}