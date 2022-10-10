type prop = {
  first_name: string
  last_name: string
}

export function compareValues(key: string, format = "asc") {
  return function innerSort(a: prop, b: prop) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0
    }

    const objA = typeof a[key as keyof prop] === "string" ? a[key as keyof prop].toUpperCase() : a[key as keyof prop]
    const objB = typeof b[key as keyof prop] === "string" ? b[key as keyof prop].toUpperCase() : b[key as keyof prop]

    let count = 0
    if (objA > objB) {
      count = 1
    } else if (objA < objB) {
      count = -1
    }
    return format === "desc" ? count * -1 : count
  }
}
