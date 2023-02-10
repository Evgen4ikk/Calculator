const calculator = document.querySelector('.calculator');
const calculatorClearBlock = document.getElementById('calculator-clear');
let allHistory = [];
let history = [];
let tempNumber = '';
let operationType = '';
let isPercent = false;
let isEqual = false;


calculator.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('calculator__col')) {
        const data = target.dataset.type;
        const totalBlock = calculator.querySelector('.calculator__total');
        const historyBlock = calculator.querySelector('.calculator__history');
        operationTypeHandling(data);
        totalBlock.innerHTML = tempNumber;
        historyBlock.innerHTML = renderHistory(history);
        historyPanelRender(allHistory);
    }
})

// Обработка нажатых клавишь на калькуляторе
function operationTypeHandling(data) {
    if (data !== 'clear' && data !== 'history') {
        calculatorClearBlock.innerHTML = 'C';
    }
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
        if (calculatorClearBlock.innerText === 'C'){
            calculatorClearBlock.innerHTML = 'CA'
        } else {
            calculatorClearBlock.innerHTML = 'C';
            allHistory = [];
        }
    } else if (data === '%') {
        history.push(tempNumber);
        isPercent = true;
        isEqual = false;
        tempNumber = calculate(history, isPercent, isEqual);
    } else if (data === '=') {
        const historySegment = [];
        if (!isPercent) {
            history.push(tempNumber);
        }
        historySegment.push(history);
        isEqual = true;
        tempNumber = calculate(history, isPercent, isEqual);
        historySegment.push(tempNumber);
        allHistory.push(historySegment);
        history = [];
        isPercent = false;
    } else if (data === 'history'){
        openHistoryPanel();
    }
}

// формирование HTML кода и вывод истории операций
function renderHistory(historyArray) {
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
    return htmlElements;
}

// Отрисовка всей истории в панели
function historyPanelRender (allHistory){
    let historyPanelHtml = '';
    const historyContent = document.getElementById('history-content');
    allHistory.forEach((item) => {
        const html = `
            <div>
                <div class="calculator__history">
                    ${renderHistory(item[0])}
                </div>
                <div class="calculator__total">${item[1]}</div>
            </div>`

        historyPanelHtml = historyPanelHtml + html
    })
    historyContent.innerHTML = historyPanelHtml;
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



// Открытие панели истори
const historyPanel = document.getElementById('history-panel');
const closeHistoryBtn = historyPanel.querySelector('#close');


closeHistoryBtn.onclick = ()=>{
        historyPanel.classList.remove('open');

}


// Открытие панели истории
function openHistoryPanel (){
    historyPanel.classList.add('open');

}