let orderConfirmation = document.getElementById('orderConfirmation')
let displayTotalItemInCart = document.getElementById('displayTotalItem')

// check if there is Internet Connection:
if (navigator.onLine) {
  // show the response from the post request stored in the session storage:
  const displayOrderConfirmation =
    ('DOMContentLoaded',
    () => {
      let thankYouText = document.createElement('h1')
      thankYouText.setAttribute('class', 'mb-5')
      thankYouText.textContent = 'Thanks for your order!'
      orderConfirmation.appendChild(thankYouText)
      let productsList = JSON.parse(sessionStorage.getItem('orderDetail'))
        .products
      let contactInformation = JSON.parse(sessionStorage.getItem('orderDetail'))
        .contact
      let orderIdText = document.createElement('h2')
      orderIdText.textContent = 'Order Number:'
      orderConfirmation.appendChild(orderIdText)
      let orderNumber = document.createElement('p')
      orderNumber.textContent = JSON.parse(
        sessionStorage.getItem('orderDetail')
      ).orderId
      orderConfirmation.appendChild(orderNumber)
      let totalCostText = document.createElement('h2')
      totalCostText.textContent = 'Total Cost:'
      orderConfirmation.appendChild(totalCostText)
      let totalCost = document.createElement('p')
      totalCost.textContent =
        '$' + (sessionStorage.getItem('orderTotalPrice') / 100).toFixed(2)
      orderConfirmation.appendChild(totalCost)
      let productsListText = document.createElement('h2')
      productsListText.textContent = 'Products List:'
      orderConfirmation.appendChild(productsListText)

      // from the array 'productlist' push the name of each item in the array 'productsNameTemporary':
      let productsNameTemporary = []
      for (i = 0; i < productsList.length; i++) {
        productsNameTemporary.push(productsList[i].name)
      }

      // from the array 'productsNameTemporary' create an object and it's properties are the name of each item and their values is the number of how many times their id has been repeated:
      var productsNameObject = {}
      productsNameTemporary.forEach(i => {
        productsNameObject[i] = (productsNameObject[i] || 0) + 1
      })

      // between each properties and its value is added an 'x', each property is split by a comma, if it's the last property is added a dot:
      let itemAndQuantity = document.createElement('p')
      itemAndQuantity.textContent =
        Object.keys(productsNameObject)
          .map(key => {
            return key + ' ' + 'x' + ' ' + productsNameObject[key]
          })
          .join(', ') + '.'
      orderConfirmation.appendChild(itemAndQuantity)

      let addressText = document.createElement('h2')
      addressText.textContent = 'Contact Information:'
      orderConfirmation.appendChild(addressText)
      let name = document.createElement('p')
      name.textContent = contactInformation.firstName
      orderConfirmation.appendChild(name)
      let surname = document.createElement('p')
      surname.textContent = contactInformation.lastName
      orderConfirmation.appendChild(surname)
      let address = document.createElement('p')
      address.textContent = contactInformation.address
      orderConfirmation.appendChild(address)
      let city = document.createElement('p')
      city.textContent = contactInformation.city
      orderConfirmation.appendChild(city)
      let email = document.createElement('p')
      email.textContent = contactInformation.email
      orderConfirmation.appendChild(email)
      // Cart in the navbar is set to 0:
      displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
    })

  displayOrderConfirmation()

  // if there is no connection show error:
} else {
  window.document.addEventListener('DOMContentLoaded', () => {
    // Cart in the navbar is set to 0:
    displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
    orderConfirmation.innerHTML = 'No Connection'
  })
}