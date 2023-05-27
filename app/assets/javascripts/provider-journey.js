//---CASE DISPOSAL--
// Select only one category from checkbox group

const category_1_checkbox = document.querySelectorAll(
    "input[name='case_disposal[category_1]']",
)
const category_2_checkbox = document.querySelectorAll(
    "input[name='case_disposal[category_2]']",
)

function selectOnlyOneCategory(event) {
    let elementName = event.target.name
    if (elementName === 'case_disposal[category_1]') {
        for (var checkbox of category_2_checkbox) {
            if (checkbox.checked) {
                checkbox.click()
                checkbox.checked = false
            }
        }
    } else if (elementName === 'case_disposal[category_2]') {
        for (var checkbox of category_1_checkbox) {
            if (checkbox.checked) {
                checkbox.click()
                checkbox.checked = false
            }
        }
    }
}
category_1_checkbox.forEach((input) => {
    input.addEventListener('change', selectOnlyOneCategory)
})
category_2_checkbox.forEach((input) => {
    input.addEventListener('change', selectOnlyOneCategory)
})

// Work item - claim_items
const claim_type_radio_group = document.querySelectorAll(
    "input[name='claim_items[claim_types]']",
)
const time_spent_hr = document.querySelector('input[name="claim_items[time_spent][hr]"]');
const time_spent_min = document.querySelector('input[name="claim_items[time_spent][min]"]');
const claim_total_amount = document.getElementById('claim-items-total');
let item_cost = 0
let claim_type_selected = false
let total_cost = 0
const cost_per_work_item = {
    'attendance with counsel assigned': 31.03,
    'attendance without counsel assigned': 31.03,
    'preperation': 45.35,
    'advocacy': 56.89,
    'travel': 24,
    'waiting': 24
}

function calculate_work_item(){
    let item_cost_per_minute = item_cost / 60
    let total_spent_hour_to_minutes = Number(time_spent_hr.value * 60)
    let total_spent_minutes = Number(time_spent_min.value)
    let total_time_in_minutes = total_spent_hour_to_minutes + total_spent_minutes
    total_cost = total_time_in_minutes * item_cost_per_minute
    return total_cost
}

function update_total_value(value) {
    let total_in_two_decimal
    value ? total_in_two_decimal = value : total_in_two_decimal = calculate_work_item().toFixed(2)
    claim_total_amount.innerHTML = '£' + total_in_two_decimal
}

claim_type_radio_group.forEach((element) => {
    element.addEventListener('change', () => {
        claim_type_selected = true
        var selectValue = Array.from(claim_type_radio_group).find(radio => radio.checked);
        item_cost = cost_per_work_item[selectValue.value]
        if(time_spent_hr.value && time_spent_min.value) {
            update_total_value()
        }
    })
});

time_spent_min.addEventListener('blur',()=>{
    update_total_value()
})

time_spent_hr.addEventListener('blur',()=>{
    update_total_value()
})

    // Calculation for the uplift checkbox
const uplift_checkbox = document.getElementById('claim-items-uplift')
const uplift_percentage = document.getElementById('claim-items-uplift-percentage')
const uplift_calculation_section = document.getElementById('claim-items-calculation-section')
const before_uplift_value = document.getElementById('claim-items-calculation-before-uplift-value')
const after_uplift_value = document.getElementById('claim-items-calculation-after-uplift-value')

function has_all_the_required_value(){
    return (claim_type_selected && time_spent_hr.value && time_spent_min.value)? true : false
}

function calculate_uplift(percent) {
    let percentAsDecimal = Number(percent / 100)
    let percentAmount = Number(percentAsDecimal) * total_cost
    let total_after_adding_percent = total_cost + percentAmount
    return total_after_adding_percent.toFixed(2)
}

uplift_percentage.addEventListener('blur',() => {
    if(has_all_the_required_value() && uplift_percentage.value) {
        let new_total = calculate_uplift(uplift_percentage.value)
        before_uplift_value.innerHTML= '£' + total_cost.toFixed(2)
        after_uplift_value.innerHTML= '£' + new_total
        update_total_value(new_total)
        uplift_calculation_section.classList.remove('hidden')
    }
})

uplift_checkbox.addEventListener('change',()=>{
    if(uplift_checkbox.checked === false){
        uplift_percentage.value = null
        update_total_value(total_cost.toFixed(2))
        uplift_calculation_section.classList.add('hidden')
    }
})
