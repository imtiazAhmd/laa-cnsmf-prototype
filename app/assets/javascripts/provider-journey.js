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
