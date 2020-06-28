/**
 * 交换数组元素
 * @param {*} fromIndex
 * @param {*} toIndex
 * @param {*} arr
 */
const swipeItem = (fromIndex, toIndex, arr) => {
    arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0]
}

/**
 * 上移元素
 * @param {Number} fromIndex
 * @param {Array} arr
 */
const moveUp = (fromIndex, arr) => {
    if (fromIndex === 0) {
        return
    }
    swipeItem(fromIndex, fromIndex - 1, arr)
}

/**
 * 下移
 * @param {Number} fromIndex
 * @param {Array} arr
 */
const moveDown = (fromIndex, arr) => {
    if (fromIndex >= arr.length - 1) return
    swipeItem(fromIndex, fromIndex + 1, arr)
}

/**
 * 根据数组长度产生随机数
 * @param {Array} arr
 */
const randomIndex = arr => {
    return Math.floor(Math.random() * arr.length)
}

/**
 * 根据state过滤类目节点
 * @param {Array} arr 树形结构数据
 * @param {String} key 需要过滤的属性key
 * @param {*} value 需要过滤的属性value
 */
const treeFilter = (key, value, arr) => {
    if (key === null || key === undefined) return arr
    for (let i = 0; i < arr.length; i++) {
        let element = arr[i]
        if (element[key] === value) {
            arr.splice(i, 1)
            treeFilter(key, value, arr)
            break
        } else {
            if (element.children && element.children.length > 0) {
                treeFilter(key, value, element.children);
            } else {
                element.children = null;
            }
        }
    }
    return arr
}

/**
 * 根据uid查找对应节点
 * @param {Number} id
 * @param {Array} arr
 */
const findNodeByUid = (id, arr) => {
    if (!id) return {
        data: {}
    }
    for (let i = 0; i < arr.length; i++) {
        if (id === arr[i].uid) {
            return arr[i]
        } else {
            findNodeByUid(id, arr[i].children)
        }

    }
}

const exchangeArrWH = (orignalArr) => {
    if (!orignalArr || orignalArr.length <= 0) return []
    const arr = orignalArr
    const arr2 = []
    const w = arr.length
    const h = arr[0].length
    const rArr = []
    arr[0].forEach(() => {
        rArr.push([])
    })
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j].m !== undefined && arr[i][j].n !== undefined) {
                arr[i][j].m = i
                arr[i][j].n = j
                arr2.push(arr[i][j])
            } else {
                arr2.push(Object.assign({m: i, n: j}, arr[i][j]))
            }
        }
    }
    for (let x = 0; x < h; x++) {
        for (let y = 0; y < arr2.length; y++) {
            if (arr2[y].n === x) {
                // 将纵坐标相同的元素push到新数组中
                rArr[x].push(arr2[y])
            }
        }
    }
    return rArr
}

const exchangeArrHW = (orignalArr) => {
    if (!orignalArr || orignalArr.length <= 0) return []
    const arr = orignalArr
    const arr2 = []
    const w = arr.length
    const h = arr[0].length
    const rArr = []

    arr[0].forEach(() => {
        rArr.push([])
    })

    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            arr2.push(Object.assign({m: i, n: j}, arr[i][j]))
        }
    }
    for (let x = 0; x < h; x++) {
        for (let y = 0; y < arr2.length; y++) {
            if (arr2[y].n === x) {
                // 将纵坐标相同的元素push到新数组中
                rArr[x].push(arr2[y])
            }
        }
    }

    return rArr
}

// 根据uid判断元素是否在数组中
const isInArray = (el, arr) => {
    var flag = false
    arr.forEach(item => {
        if (el.uid === item.uid) {
            flag = true
        }
    })
    return false
}

export {
    swipeItem,
    moveUp,
    moveDown,
    randomIndex,
    treeFilter,
    findNodeByUid,
    exchangeArrWH,
    exchangeArrHW,
    isInArray
}
