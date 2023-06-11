let str = "1203-133"

const validateNumber = (...args) => {
    const index = str.indexOf('-')
    if(index === 2 || index === 3) return true;
    return false
}

console.log(validateNumber(str))

