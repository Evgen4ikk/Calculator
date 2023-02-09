const calculator = document.querySelector('.calculator');
let history = [];
let tempNumber = '';
let operationType = '';
let isPercent = false;
let isEqual = false;


calculator.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('calculator__col')) {
        const data = target.dataset.type;
        operationTypeHandling(data);
        renderTotal(tempNumber);
        renderHistory(history);
    }
})

// Обработка нажатых клавишь на калькуляторе
function operationTypeHandling(data) {
    if (data >= 0) {
        operationType = 'number';
        tempNumber = tempNumber === '0' ? data : tempNumber + data;
    } else if (data === 'float') {
        operationType = 'number';
        if (!/\./.test(tempNumber)) {
            if (tempNumber) {
                tempNumber = tempNumber + '.'
            } else {
                tempNumber = '0.'
            }
        }
    } else if (data === 'delete' && operationType === 'number') {
        tempNumber = tempNumber.substring(0, tempNumber.length - 1);
        tempNumber = tempNumber ? tempNumber : '0';
        isPercent = false;
    } else if (['+', '-', '/', '*'].includes(data) && tempNumber) {
        operationType = data;
        history.push(tempNumber, operationType);
        tempNumber = '';
        isPercent = false;
    } else if (data === 'clear') {
        history = [];
        tempNumber = '0';
        isPercent = false;
    } else if (data === '%') {
        history.push(tempNumber);
        isPercent = true;
        isEqual = false;
        tempNumber = calculate(history, isPercent, isEqual);
    } else if (data === '=') {
        if (!isPercent) {
            history.push(tempNumber);
        }
        isEqual = true;
        tempNumber = calculate(history, isPercent, isEqual);
        history = [];
        isPercent = false;
    }
}

//Отрисовка текущего значения на экране калькулятора
function renderTotal(value) {
    const totalBlock = calculator.querySelector('.calculator__total');
    totalBlock.innerHTML = value;
}

// формирование HTML кода и вывод истории операций
function renderHistory(historyArray) {
    const historyBlock = calculator.querySelector('.calculator__history');
    let htmlElements = '';
    historyArray.forEach((item) => {
        if (item >= 0) {
            htmlElements = htmlElements + `&nbsp;<span>${item}</span>`;
        } else if (['+', '-', '/', '*', '%'].includes(item)) {
            item = item === "*" 
                ? '×' 
                    : item === '/' 
                    ? '÷' 
                        : item;
            htmlElements = htmlElements + `&nbsp;<strong>${item}</strong>`;
        }
    })
    historyBlock.innerHTML = htmlElements;
}


// подсчет конечного значения
function calculate(historyArray, isPercent, isEqual) {
    let total = 0;
    historyArray.forEach((item, idx) => {
        item = parseFloat(item);
        if (idx === 0) {
            total = item;
        } else if (
            idx - 2 >= 0 
            && isPercent 
            && idx - 2 === historyArray.length - 3
        ) {
            const x = total;
            const operation = historyArray[idx - 1];
            const n = item;
            if (!isEqual) {
                total = calculatePercent(x, operation, n);
            } else {
                total = calculatePercentWhenPushEqual(x, operation, n);
            }
        } else if (idx - 2 >= 0) {
            const prevItem = historyArray[idx - 1];
            if (item >= 0) {
                if (prevItem === '+') {
                    total = total + item;
                } else if (prevItem === '-') {
                    total = total - item;
                } else if (prevItem === '/') {
                    total = total / item;
                } else if (prevItem === '*') {
                    total = total * item;
                } else if (prevItem === '%') {
                    total = total / 100 * item;
                }
            }
        }
    })
    return String(total);
}


// пересчет процента когда нажат %
function calculatePercent(x, operation, n) {
    let total
    if (['+', '-'].includes(operation)) {
        total = x * (n / 100);
    } else if (['*', '/'].includes(operation)) {
        total = n / 100;
    }
    return total
}

// Пересчет ароцента когда нажали равно, после нажатия процента
function calculatePercentWhenPushEqual(x, operation, n){
    let total;
    if (operation === '+'){
        total = x + (n / 100 * x);
    } else if (operation === '-') {
        total = x - (n / 100 * x)
    } else if (operation === '*') {
        total = x * (n / 100)
    } else if (operation === '/') {
        total = x / (n / 100)
    }
    return total;
}

// Смена темы 
const theme = document.querySelector('.theme');
theme.onclick = () =>{
    if (theme.classList.contains('theme_dark')) {
     theme.classList.remove('theme_dark');
     calculator.classList.add('calculator_dark')  
    } else {
        theme.classList.add('theme_dark');   
        calculator.classList.remove('calculator_dark')  
    }
}
