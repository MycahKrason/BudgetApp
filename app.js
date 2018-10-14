///////////////////////
///Budget Controller///
///////////////////////

var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
            
            this.percentage = Math.round((this.value / totalIncome) * 100);

        }else{
            this.percentage = -1;
        }
        
    }
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            
            sum = sum + cur.value;
            console.log(sum);
        });
            
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0, 
            inc: 0
        }, 
        budget: 0,
        percentage: -1
        
    };
    
    return{
        
        addItem: function(type, des, val){
            
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                
            } else {
                
                ID = 0;
                
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
                
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
            
        }, 
        
        deleteItem: function(type, id){
            
            var ids, index;
            
            var ids = data.allItems[type].map(function(current){
                return current.id
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function(){
            
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
            
        },
        
        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            })
            
            
        },
        
        getPercentages: function(){
            
            //create an array of all percentages for exp
            var allPercentages = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            
            return allPercentages;
        }, 
        
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        
        testing: function(){
            console.log(data);
        }
    }
    
})();




///////////////////
///UI Controller///
///////////////////

var UIController = (function(){
    
    var DOMStrings = {
        inputType: '.addType', 
        inputDescription: '.addDescription',
        inputValue: '.addValue',
        inputBtn: '.addBtn',
        incomeComtainer: '.incomeList',
        expensesContainer: '.expensesList',
        budgetLabel: '.budgetValue',
        incomeLabel: '.budgetIncomeValue',
        expensesLabel: '.budgetExpensesValue',
        percentageLabel: '.budgetExpensesPercentage',
        container: '.container',
        expensesPercLabel: '.itemPercentage',
        dateLabel: '.budgetTitleMonth'
        
        
    }
    
    var formatNumber = function(number, type){
        var numSplit, int, dec, type, sign;
            
        number = Math.abs(number);
        number = number.toFixed(2);
        numSplit = number.split('.');
            
        int = numSplit[0];
        if(int.length > 3){
           int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
            
        dec = numSplit[1];
        
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }
    
    
    return{
        
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
            
        },
        
        addListItem: function(obj, type){
            
            var html, newHTML, element;
            
            //Create HTML with place holder text
            
            if(type === 'inc'){
                
                element = DOMStrings.incomeComtainer;
                
                html = '<div class="item" id="inc-%id%"> <div class="itemDescription">%description%</div> <div class="right"> <div class="itemValue">%value%</div> <div class="itemDelete"> <button class="itemDeleteBtn"></button> </div> </div> </div>';
                
            }else if(type === 'exp'){
                
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item" id="exp-%id%"> <div class="itemDescription">%description%</div> <div class="right"> <div class="itemValue">%value%</div> <div class="itemPercentage">21%</div> <div class="itemDelete"> <button class="itemDeleteBtn"></button> </div> </div> </div>';
                
;      
            }
            
            //Replace the place holder text
            
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));
            
            
            //insert the html in the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
            
        },
        
        deleteListItem: function(selectorID){
          
            var element = document.getElementById(selectorID)
            
            element.parentNode.removeChild(element);
            
        },
        
        clearFields: function(){
            var fields, fieldsArray;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            //QueryselectoryAll returns a list... but we need an array
            fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array){
                current.value = '';
            })
            
            fieldsArray[0].focus();
            
        },
        
        displayBudget: function(obj){
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            }
            
            nodeListForEach(fields, function(current, index){
                
                if(percentages[index] > 0 ){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
            
        },
        
        displayMonth: function(){
            var now, year, months, month;
            
            now = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month - 1] + ' ' + year;
        },
        
        getDOMStrings: function(){
            return DOMStrings;
        }
        
    };
    
})();


////////////////////
///App Controller///
////////////////////

var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();

        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
        
            if(event.keyCode === 13 || event.which === 13){

                ctrlAddItem();

            }

        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }
    
    var updateBudget = function(){
        //1 calculate the budget
        budgetCtrl.calculateBudget();
        
        //2 Return the budget
        var budget = budgetCtrl.getBudget();
        
        //3 display the budget
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function(){
        //calculate percantages
        budgetCtrl.calculatePercentages();
        //get the percentages
        var percentages = budgetCtrl.getPercentages();
        //display percentages
        UICtrl.displayPercentages(percentages)
        
    };
    
    var ctrlAddItem = function(){
        
        var input, newItem;
        
        //1 get input data
        input = UICtrl.getInput();
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //2 add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3 add item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4 clear the fields
            UICtrl.clearFields();

            //5 calculate and update budget
            updateBudget();
            
            //6 calculate and update percentages
            updatePercentages();
        }
        
    }
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            //split the id to get the number
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //Delete the item from the data
            budgetCtrl.deleteItem(type, ID);
            
            //Delete from UI
            UICtrl.deleteListItem(itemID);
            
            //Recalculate and show new budget and percentages
            updateBudget();
            updatePercentages();
            
            
            
        }
    }
    
    return{
        init: function(){
            
            UICtrl.displayMonth();
            
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1});
            
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();