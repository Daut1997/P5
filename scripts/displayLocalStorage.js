let loadingGif = document.getElementById('loadingGif')
let alertMessage = document.getElementById('alert')
let cartContainer = document.getElementById('cartContainer')

// check if there is Internet Connection:
if (navigator.onLine) {
  let displayCart = document.getElementById('cart')
  // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in the cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
  if (localStorage.getItem('totalItemInCart') === null) {
    let displayTotalItemInCart = document.getElementById('displayTotalItem')
    displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
  } else {
    document.getElementById('displayTotalItem').textContent =
      'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
  }

  // loop through the key in local storage and if their value is an object push it in the array 'localStorageValues':
  let localStorageValues = []
  for (let i in localStorage) {
    if (localStorage.hasOwnProperty(i)) {
      localStorageValues.push(JSON.parse(localStorage[i]))
    }
  }

  // loop through the objects in the array 'localStorageValues' and push the properties of each object in the array named 'cart':
  let cart = []
  localStorageValues.forEach(obj => {
    Object.keys(obj).forEach(key => {
      cart.push(obj[key])
    })
  })

  // loop through each object in the 'cart' array and for each object create a new array inside the array 'arraysOfId', each array created contains the Id key repeated times the quantity key of the object:
  let arraysOfId = []
  for (i = 0; i < cart.length; i++) {
    arraysOfId[i] = new Array(cart[i].quantity).fill(cart[i].id)
  }
  // concatenate all the arrays of Id present in the arrays 'arraysofId' into the array 'product':
  let products = [].concat.apply([], arraysOfId)

  // for each object in the array Cart create a figurecaption containing the image of the object, the price, the quantity, the plus and minus quantity buttons, the total cost and the remove item button:
  for (i = 0; i < cart.length; i++) {
    let itemContainer = document.createElement('figure')
    itemContainer.setAttribute('class', 'col-12')
    let image = document.createElement('img')
    image.src = cart[i].image
    itemContainer.appendChild(image)
    let figCaption = document.createElement('figcaption')
    itemContainer.appendChild(figCaption)
    let color = document.createElement('p')
    color.textContent = cart[i].color
    figCaption.appendChild(color)
    let price = document.createElement('p')
    price.textContent = '$' + (cart[i].price / 100).toFixed(2)
    figCaption.appendChild(price)
    let quantityContainer = document.createElement('div')
    quantityContainer.style.display = 'flex'
    quantityContainer.style.justifyContent = 'space-around'
    quantityContainer.style.alignItems = 'center'
    figCaption.appendChild(quantityContainer)
    let minusButton = document.createElement('button')
    minusButton.textContent = '-'
    minusButton.value = cart[i].color
    minusButton.name = cart[i].id
    minusButton.setAttribute(
      'class',
      'minusButton bg-secondary text-light rounded-circle'
    )
    quantityContainer.appendChild(minusButton)
    let quantity = document.createElement('p')
    quantity.textContent = cart[i].quantity
    quantityContainer.appendChild(quantity)
    let plusButton = document.createElement('button')
    plusButton.textContent = '+'
    plusButton.value = cart[i].color
    plusButton.name = cart[i].id
    plusButton.setAttribute(
      'class',
      'plusButton bg-secondary text-light rounded-circle'
    )
    quantityContainer.appendChild(plusButton)
    let totalPrice = document.createElement('p')
    totalPrice.textContent =
      '$' + ((cart[i].price * cart[i].quantity) / 100).toFixed(2)
    figCaption.appendChild(totalPrice)
    let removeItemButton = document.createElement('button')
    removeItemButton.setAttribute('class', 'removeItem bg-secondary text-light')
    removeItemButton.textContent = 'Remove Item'
    removeItemButton.value = cart[i].color
    removeItemButton.name = cart[i].id
    figCaption.appendChild(removeItemButton)
    let displayCart = document.getElementById('cart')
    displayCart.appendChild(itemContainer)
  }

  // code for the functionality of the minus button, reduce quantity of one:
  let reduceQuantity = document.querySelectorAll('.minusButton')
  for (i = 0; i < reduceQuantity.length; i++) {
    reduceQuantity[i].addEventListener('click', $event => {
      let totalItem = localStorage.getItem('totalItemInCart')
      totalItem = parseInt(totalItem)
      localStorage.setItem('totalItemInCart', totalItem - 1)
      itemInCart = localStorage.getItem($event.target.name)
      itemInCart = JSON.parse(itemInCart)
      // reduce quantity in the cart element in the navbar:
      document.getElementById('displayTotalItem').textContent =
        'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
      // reduce the price of key 'totalcost' in the localstorage:
      let totalCost = localStorage.getItem('totalCost')
      totalCost = parseInt(totalCost)
      localStorage.setItem(
        'totalCost',
        totalCost - itemInCart[$event.target.value].price
      )
      // if the quantity is greater then one then decrease it by one in the localStorage and reduce the totalcost of the item displayed:
      if (itemInCart[$event.target.value].quantity > 1) {
        itemInCart[$event.target.value].quantity -= 1
        $event.target.parentElement.nextElementSibling.textContent =
          '$' +
          (
            (itemInCart[$event.target.value].price *
              itemInCart[$event.target.value].quantity) /
            100
          ).toFixed(2)
        // if quantity is lower than one remove the object from localStorage:
      } else {
        delete itemInCart[$event.target.value]
      }
      // if the key in localStorage become an empty object with no properties is automatically removed:
      localStorage.setItem($event.target.name, JSON.stringify(itemInCart))
      if (localStorage.getItem($event.target.name) == '{}') {
        localStorage.removeItem($event.target.name)
      }
      // decrease the displayed quantity of the item by one:
      $event.target.nextSibling.textContent =
        Number($event.target.nextSibling.textContent) - 1
      // when the item quantity is equal to zero a message appear to show that items has been removed, and after 1000ms the message disappear:
      if ($event.target.nextSibling.textContent < 1) {
        alertMessage.removeAttribute('hidden')
        setTimeout(() => {
          alertMessage.setAttribute('hidden', 'true')
        }, 1000)
        // when the item quantity is equal to zero the item is not displayed anymore:
        displayCart.removeChild(
          $event.target.parentElement.parentElement.parentElement
        )
      }
      // if there are no more teddies displayed in the cart the page reload:
      if (displayCart.childNodes.length < 1) {
        location.reload()
      }
    })
  }

  // code for the functionality of the plus button, increase quantity of one::
  let increaseQuantity = document.querySelectorAll('.plusButton')
  for (i = 0; i < increaseQuantity.length; i++) {
    increaseQuantity[i].addEventListener('click', $event => {
      // increase quantity by one in the localStorage key 'totalitemincart':
      let totalItem = localStorage.getItem('totalItemInCart')
      totalItem = parseInt(totalItem)
      localStorage.setItem('totalItemInCart', totalItem + 1)
      itemInCart = localStorage.getItem($event.target.name)
      itemInCart = JSON.parse(itemInCart)
      // increase quantity in the cart element in the navbar:
      document.getElementById('displayTotalItem').textContent =
        'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
      // increase quantity by one in the localStorage:
      itemInCart[$event.target.value].quantity += 1
      // increase the totalcost displayed of the target item:
      $event.target.parentElement.nextElementSibling.textContent =
        '$' +
        (
          (itemInCart[$event.target.value].price *
            itemInCart[$event.target.value].quantity) /
          100
        ).toFixed(2)
      localStorage.setItem($event.target.name, JSON.stringify(itemInCart))
      // increase the value of the 'totalcost' key in localstorage:
      let totalCost = localStorage.getItem('totalCost')
      totalCost = parseInt(totalCost)
      localStorage.setItem(
        'totalCost',
        totalCost + itemInCart[$event.target.value].price
      )
      // increase displayed quantity by one:
      $event.target.previousSibling.textContent =
        Number($event.target.previousSibling.textContent) + 1
    })
  }

  // code for the functionality of the remove item button:
  let removeItem = document.querySelectorAll('.removeItem')
  for (i = 0; i < removeItem.length; i++) {
    removeItem[i].addEventListener('click', $event => {
      // a message appear when remove item button is clicked and disappear after 1000ms:
      alertMessage.removeAttribute('hidden')
      setTimeout(() => {
        alertMessage.setAttribute('hidden', 'true')
      }, 1000)
      let totalItem = localStorage.getItem('totalItemInCart')
      totalItem = parseInt(totalItem)
      itemInCart = localStorage.getItem($event.target.name)
      itemInCart = JSON.parse(itemInCart)
      let totalCost = localStorage.getItem('totalCost')
      totalCost = parseInt(totalCost)
      // the totalcost of the item is decreased from the key in the localStorage 'totalcost':
      localStorage.setItem(
        'totalCost',
        totalCost -
          itemInCart[$event.target.value].price *
            itemInCart[$event.target.value].quantity
      )
      // the quantity of the item removed is decreased from the localStorage key 'totalitemincart':
      localStorage.setItem(
        'totalItemInCart',
        totalItem - itemInCart[$event.target.value].quantity
      )
      // the object is removed from the localStorage:
      delete itemInCart[$event.target.value]
      localStorage.setItem($event.target.name, JSON.stringify(itemInCart))
      // quantity is updated in the cart element in the navbar:
      document.getElementById('displayTotalItem').textContent =
        'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
      // when the key in localStorage become an empty object with no properties is automatically removed:
      if (localStorage.getItem($event.target.name) == '{}') {
        localStorage.removeItem($event.target.name)
      }
      // the item is not displayed anymore:
      displayCart.removeChild(
        $event.target.previousSibling.parentElement.parentElement
      )
      // when the cart is empty with no item to display the page reload:
      if (displayCart.childNodes.length < 1) {
        location.reload()
      }
    })
  }

  // set a contact object:
  let contact = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: ''
  }

  // for each input element create a p element to display if the input is valid or not:
  let formInputField = document.querySelectorAll('.form-group')
  for (i = 0; i < formInputField.length; i++) {
    let alertText = document.createElement('p')
    formInputField[i].appendChild(alertText)
  }

  let checkoutButton = document.getElementById('submitOrder')
  let checkoutInputField = document.querySelectorAll('input')
  let checkoutForm = document.getElementById('inputForm')
  let formContainer = document.getElementById('formContainer')
  // check if the lenght of the array 'products' is greater than one:
  if (products.length >= 1) {
    checkoutForm.removeAttribute('hidden')
    // input event listener added to form to check if the value of each input is greater than zero and respect its pattern:
    for (i = 0; i < checkoutInputField.length; i++) {
      checkoutInputField[i].addEventListener('input', $event => {
        inputValidation($event)
      })
      // blur event listener added to form to check if the value of each input is greater than zero and respect its pattern:
      checkoutInputField[i].addEventListener('blur', $event => {
        inputValidation($event)
      })
    }
    // if the lenght of the array 'products' is lower than one the form is hiden and appear a written 'Your Cart is Empty':
  } else {
    checkoutForm.setAttribute('hidden', 'true')
    let text = document.createElement('p')
    text.setAttribute('class', 'font-weight-bold mt-5')
    text.textContent = 'Your Cart Is Empty'
    formContainer.appendChild(text)
  }
  // inputValidation function added to the blur and input event. Set the border to green or red and display an alert message if the input is valid or not:
  const inputValidation = $event => {
    if ($event.target.value.length < 1) {
      $event.target.style.border = '2px solid red'
      $event.target.nextElementSibling.style.color = 'red'
      $event.target.nextElementSibling.textContent = 'Field Required'
    } else if (
      $event.target.value.length >= 1 &&
      !$event.target.value.match($event.target.pattern)
    ) {
      $event.target.style.border = '2px solid red'
      $event.target.nextElementSibling.style.color = 'red'
      $event.target.nextElementSibling.textContent = 'Format Not Valid'
    } else {
      $event.target.style.border = '2px solid greenyellow'
      $event.target.nextElementSibling.style.color = 'green'
      $event.target.nextElementSibling.textContent =
        'Valid' + ' ' + $event.target.name
    }
  }

  // check if the value lenght of each input field is greater than 0 and match its respective pattern, if so the submit order button is enabled, otherwise not:
  for (i = 0; i < checkoutInputField.length; i++) {
    checkoutInputField[i].addEventListener('input', () => {
      if (
        checkoutInputField[0].value.length >= 1 &&
        checkoutInputField[0].value.match(checkoutInputField[0].pattern) &&
        checkoutInputField[1].value.length >= 1 &&
        checkoutInputField[1].value.match(checkoutInputField[1].pattern) &&
        checkoutInputField[2].value.length >= 1 &&
        checkoutInputField[2].value.match(checkoutInputField[2].pattern) &&
        checkoutInputField[3].value.length >= 1 &&
        checkoutInputField[3].value.match(checkoutInputField[3].pattern) &&
        checkoutInputField[4].value.length >= 1 &&
        checkoutInputField[4].value.match(checkoutInputField[4].pattern)
      ) {
        checkoutButton.removeAttribute('hidden')
      } else {
        checkoutButton.setAttribute('hidden', 'true')
      }
    })
  }

  // when submit order button is pressed the content of the cart page is hiden and a gif is displayed:
  checkoutButton.addEventListener('click', $event => {
    document.getElementById('cartPage').setAttribute('hidden', 'true')
    loadingGif.removeAttribute('hidden')
    $event.preventDefault()
    setContactValues()
    // the function to submit the order is called only if all the input form lenght is greater than 0 and respect its pattern:
    if (
      checkoutInputField[0].value.length >= 1 &&
      checkoutInputField[0].value.match(checkoutInputField[0].pattern) &&
      checkoutInputField[1].value.length >= 1 &&
      checkoutInputField[1].value.match(checkoutInputField[1].pattern) &&
      checkoutInputField[2].value.length >= 1 &&
      checkoutInputField[2].value.match(checkoutInputField[2].pattern) &&
      checkoutInputField[3].value.length >= 1 &&
      checkoutInputField[3].value.match(checkoutInputField[3].pattern) &&
      checkoutInputField[4].value.length >= 1 &&
      checkoutInputField[4].value.match(checkoutInputField[4].pattern)
    ) {
      submitOrder()
    }
    // when pressed back button or refresh button the input text field still contained previous informations, so fixed with the follow lines:
    for (i = 0; i < checkoutInputField.length; i++) {
      checkoutInputField[i].value = ''
    }
  })

  // set the value of the properties of the 'contact' object equal to the value of the input text form:
  const setContactValues = () => {
    contact.firstName = checkoutInputField[0].value
    contact.lastName = checkoutInputField[1].value
    contact.address = checkoutInputField[2].value
    contact.city = checkoutInputField[3].value
    contact.email = checkoutInputField[4].value
  }

  // submit order function:
  const submitOrder = () => {
    // Promise:
    const promise = new Promise((resolve, reject) => {
      // refresh the array 'products' containing the id of all the teddies before to be sent to the server:
      let localStorageValues = []
      for (let i in localStorage) {
        if (localStorage.hasOwnProperty(i)) {
          localStorageValues.push(JSON.parse(localStorage[i]))
        }
      }
      let cart = []
      localStorageValues.forEach(function (obj) {
        Object.keys(obj).forEach(key => {
          cart.push(obj[key])
        })
      })
      let arraysOfId = []
      for (i = 0; i < cart.length; i++) {
        arraysOfId[i] = new Array(cart[i].quantity).fill(cart[i].id)
      }
      let products = [].concat.apply([], arraysOfId)

      let postRequest = new XMLHttpRequest()
      let data = { contact: contact, products: products }
      let url = 'http://localhost:3000/api/teddies/order'
      postRequest.open('POST', url, true)
      postRequest.setRequestHeader('Content-type', 'application/json')
      postRequest.send(JSON.stringify(data))
      postRequest.onreadystatechange = () => {
        if (postRequest.readyState === 4) {
          if (postRequest.status === 201) {
            resolve(JSON.parse(postRequest.response))
          } else {
            reject(postRequest.response)
          }
        }
      }
    })
    // if the promise resolve:
    promise
      .then(response => {
        // the totalcost pass from localStorage to SessionStorage:
        sessionStorage.setItem(
          'orderTotalPrice',
          localStorage.getItem('totalCost')
        )
        // localStorage is cleared:
        localStorage.clear()
        // the response from the server is stored in the sessionStorage:
        sessionStorage.setItem('orderDetail', JSON.stringify(response))

        // link to the orderconfirmation page:
        location.href = 'orderConfirmation.html'
        // if promise doesn't resolve:
      })
      .catch(error => {
        // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
        if (localStorage.getItem('totalItemInCart') === null) {
          let displayTotalItemInCart = document.getElementById(
            'displayTotalItem'
          )
          displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
        } else {
          document.getElementById('displayTotalItem').textContent =
            'Cart' + ' ' + '(' + localStorage.getItem('totalItemIncart') + ')'
        }
        console.log(error)
        // the loadinggif is hided to display the error:
        loadingGif.setAttribute('hidden', 'true')
        // if there is no answer from server it is showed network error because of no connection to the server:
        if (!error) {
          let errorMessage = document.createElement('p')
          errorMessage.textContent = 'Error: Network Error'
          let cartPage = document.getElementById('cartPage')
          cartPage.removeAttribute('hidden')
          cartPage.removeChild(cartPage.childNodes[1])
          checkoutForm.setAttribute('hidden', 'true')
          formContainer.className = 'col-12 text-center pt-5'
          formContainer.appendChild(errorMessage)
          // if there is answer from server, display the answer from server as an error:
        } else {
          let errorMessage = document.createElement('p')
          errorMessage.textContent = 'There is a problem with the backend'
          let cartPage = document.getElementById('cartPage')
          cartPage.removeAttribute('hidden')
          cartPage.removeChild(cartPage.childNodes[1])
          checkoutForm.setAttribute('hidden', 'true')
          formContainer.className = 'col-12 text-center pt-5'
          formContainer.appendChild(errorMessage)
        }
      })
  }
  // if there is no connection show error 'no connection':
} else {
  window.document.addEventListener('DOMContentLoaded', () => {
    // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
    if (localStorage.getItem('totalItemInCart') === null) {
      let displayTotalItemInCart = document.getElementById('displayTotalItem')
      displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
    } else {
      document.getElementById('displayTotalItem').textContent =
        'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
    }
    // the loading gif is hided and error showed:
    loadingGif.setAttribute('hidden', 'true')
    let cartPage = document.getElementById('cartPage')
    cartPage.removeAttribute('hidden')
    cartPage.removeChild(cartPage.childNodes[1])
    let checkoutForm = document.getElementById('inputForm')
    checkoutForm.setAttribute('hidden', 'true')
    let formContainer = document.getElementById('formContainer')
    formContainer.className = 'col-12 text-center pt-5'
    formContainer.innerHTML = 'No Connection'
  })
}