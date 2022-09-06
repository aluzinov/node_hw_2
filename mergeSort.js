const arraycopy = (a1, i, a3, k) => {
  for (let n = i; n < a1.length; n++) {
    a3[k++] = a1[n]
  }
}

const merge = (a1, a2) => {
  let i=0, j=0, k=0;
  const a3 = [a1.length + a2.length]
  while(i < a1.length && j < a2.length) {
    a3[k++] = a1[i] < a2[j] ? a1[i++] : a2[j++];
  }
  if(i< a1.length) {
    arraycopy(a1, i, a3, k, a1.length - i);
  } else if(j< a2.length) {
    arraycopy(a2, j, a3, k, a2.length - j);
  }
  return a3
}

export const mergeSort = (source) => {
  if (source.length == 0 || source.length == 1)
    return source

  const half = Math.floor(source.length / 2)
  const left = mergeSort(source.slice(0, half))
  const right = mergeSort(source.slice(half))
  const result = merge(left, right)
  return result
}