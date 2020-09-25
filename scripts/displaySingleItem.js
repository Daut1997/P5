let singleItem = document.getElementById('item')
let loadingGif = document.getElementById('loadingGif')
let itemDetails = document.getElementById('itemDetails')
let alertMessage = document.getElementById('alert')

// if there is Internet Connection:
if (navigator.onLine) {
  // Promise:
  const promise = new Promise((resolve, reject) => {
    let url = window.location.search.replace('?', '')
    let apiRequest = new XMLHttpRequest()
    apiRequest.open('GET', 'http://localhost:3000/api/teddies/' + url)
    apiRequest.send()
    apiRequest.onreadystatechange = () => {
      if (apiRequest.readyState === 4) {
        if (apiRequest.status === 200) {
          resolve(JSON.parse(apiRequest.response))
        } else {
          reject(apiRequest.response)
        }
      }
    }
  })
  // if Promise resolve create a item image, with his name, description and price:
  promise
    .then(response => {
      // remove loading gif:
      singleItem.removeChild(loadingGif)
      // display item description with price, name, quantity selection, color dropdown and button to add to the cart:
      itemDetails.removeAttribute('hidden')
      // display item image:
      document.getElementById('imageContainer').removeAttribute('hidden')
      let name = document.getElementById('name')
      name.textContent = response.name
      let image = document.getElementById('image')
      image.src = response.imageUrl
      let description = document.getElementById('description')
      description.textContent = response.description
      let price = document.getElementById('price')
      price.textContent = '$' + (response.price / 100).toFixed(2)
      // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
      if (localStorage.getItem('totalItemInCart') === null) {
        let displayTotalItemInCart = document.getElementById('displayTotalItem')
        displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
      } else {
        document.getElementById('displayTotalItem').textContent =
          'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
      }

      // set an object with properties equal to the response got from the server:
      let item = {
        id: response._id,
        image: response.imageUrl.replace('http://localhost:3000/', '../'),
        color: response.colors[0],
        quantity: 1,
        price: response.price
      }

      // minus quantity button:
      let quantityToAdd = document.getElementById('quantityToAdd')
      let minusButton = document.getElementById('minusButton')
      minusButton.addEventListener('click', () => {
        // if the quantity is equal or greater than 2 decrease quantity by one when minus button is pressed:
        if (item.quantity >= 2 && quantityToAdd.textContent >= 2) {
          item.quantity = item.quantity - 1
          quantityToAdd.textContent = Number(quantityToAdd.textContent) - 1
          // if quantity is lower than 2 set the quantity to 1 and don't decrease it:
        } else {
          item.quantity = item.quantity
          quantityToAdd = quantityToAdd
        }
      })

      // increase quantity button by 1 when pressed:
      let plusButton = document.getElementById('plusButton')
      plusButton.addEventListener('click', () => {
        item.quantity = item.quantity + 1
        quantityToAdd.textContent = Number(quantityToAdd.textContent) + 1
      })

      // set the text content for the color dropdown button:
      let colorDrop = document.getElementById('colorButton')
      colorDrop.textContent = response.colors[0]

      // set the colors in colors dropdown:
      let dropDown = document.getElementById('colors')
      for (i = 0; i < response.colors.length; i++) {
        let colorsOption = document.createElement('p')
        colorsOption.textContent = response.colors[i]
        colorsOption.setAttribute('class', 'dropdown-item')
        dropDown.appendChild(colorsOption)
        colorsOption.setAttribute('class', 'choosecolors')
      }

      // if item has just one variant of color the dropdown is not showed:
      if (dropDown.childElementCount <= 1) {
        dropDown.setAttribute('hidden', 'true')
      }

      // the text of the color dropdown button is equal to the text of the clicked color:
      let choosecolors = document.querySelectorAll('.choosecolors')
      for (i = 0; i < choosecolors.length; i++) {
        choosecolors[i].addEventListener('click', $event => {
          item.color = $event.target.textContent
          colorDrop.textContent = $event.target.textContent
        })
      }

      // create a figurecaption containing the button to add the item to the cart:
      let addToCartButton = document.createElement('button')
      addToCartButton.type = 'button'
      addToCartButton.setAttribute(
        'class',
        'btn btn-secondary text-light mt-5 mb-5'
      )
      itemDetails.appendChild(addToCartButton)
      addToCartButton.textContent = 'Add To Cart'
      addToCartButton.addEventListener('click', () => {
        // remove hidden attribute to the message that show that the item has been added to the cart:
        alertMessage.removeAttribute('hidden')
        // after 1000ms the message 'Item Added To Cart' disappear:
        setTimeout(() => {
          alertMessage.setAttribute('hidden', 'true')
        }, 1000)
        totalItemInCart()
        addItemToCart()
        totalCost()
        // set the quantity showed in the basket equal to the value of the key 'totalitemincart' in the LocalStorage:
        document.getElementById('displayTotalItem').textContent =
          'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
        // when the button to add item to the cart is pressed, the colors dropdown and the menu to choose the quantity get resetted:
        colorDrop.textContent = response.colors[0]
        item.quantity = 1
        item.color = response.colors[0]
        quantityToAdd.textContent = 1
      })

      // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
      const totalItemInCart = () => {
        let totalItem = localStorage.getItem('totalItemInCart')
        totalItem = parseInt(totalItem)
        if (totalItem) {
          localStorage.setItem('totalItemInCart', totalItem + item.quantity)
        } else {
          localStorage.setItem('totalItemInCart', item.quantity)
        }
      }

      // set a key in local storage equal to the Id of the item, the value of the key in an object containing the different colors of items added to the cart:
      const addItemToCart = () => {
        // itemInCart is the value of the key (item id) in LocalStorage, itemInCart is an object:
        itemInCart = localStorage.getItem(response._id)
        // check if the key is already set in localStorage:
        itemInCart = JSON.parse(itemInCart)
        // if itemincart already contains objects in it:
        if (itemInCart !== null) {
          // if the item we are trying to add is not in localStorage (itemInCart) yet, create a new object but keeps what was already in it:
          if (itemInCart[item.color] == undefined) {
            // second item with same Id but different color was being added twice showing the quantity added times 2, so added the following line to fix that:
            item.quantity /= 2

            itemInCart = {
              ...itemInCart,
              [item.color]: item
            }
          }

          // increase quantity by the quantity selected if the item we are trying to add is already in localStorage (itemInCart):
          itemInCart[item.color].quantity += item.quantity

          // if itemInCart is empty add a new property to it, the property added is an object named like the colour of the item we are trying to add:
        } else {
          itemInCart = {
            [item.color]: item
          }
        }

        // set a key in localStorage (item Id), it's value is the object 'itemInCart':
        localStorage.setItem(response._id, JSON.stringify(itemInCart))
      }

      // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
      const totalCost = () => {
        let cartCost = localStorage.getItem('totalCost')
        if (cartCost != null) {
          cartCost = parseInt(cartCost)
          localStorage.setItem(
            'totalCost',
            cartCost + item.price * item.quantity
          )
        } else {
          localStorage.setItem('totalCost', item.price * item.quantity)
        }
      }
      // if the Promise doesn't resolve:
    })
    .catch(error => {
      // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
      if (localStorage.getItem('totalItemInCart') === null) {
        let displayTotalItemInCart = document.getElementById('displayTotalItem')
        displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
      } else {
        document.getElementById('displayTotalItem').textContent =
          'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
      }
      console.log(error)
      // remove loading gif:
      loadingGif.setAttribute('hidden', 'true')
      // remove hidden attribute to itemdetails section in order to show the error:
      itemDetails.removeAttribute('hidden')
      // if it doesn't get response from server show 'Network Error' otherwise show the response from the server:
      if (!error) {
        let errorMessage = document.getElementById('itemDetails')
        errorMessage.classList.remove('col-xl-6')
        errorMessage.className = 'overflow-auto text-center m-auto p-5'
        singleItem.removeChild(errorMessage.previousElementSibling)
        errorMessage.innerHTML = 'Error: Network Error'
      } else {
        let errorMessage = document.getElementById('itemDetails')
        errorMessage.classList.remove('col-xl-6')
        errorMessage.className = 'overflow-auto text-center m-auto p-5'
        let singleItem = document.getElementById('item')
        singleItem.removeChild(errorMessage.previousElementSibling)
        errorMessage.innerHTML = 'item Not Found'
      }
    })
  // if there is not connection to internet show error 'No Connection':
} else {
  // remove loading gif:
  singleItem.removeChild(loadingGif)
  // remove hidden attribute to itemdetails section in order to show the error:
  itemDetails.removeAttribute('hidden')
  window.document.addEventListener('DOMContentLoaded', () => {
    // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
    if (localStorage.getItem('totalItemInCart') === null) {
      let displayTotalItemInCart = document.getElementById('displayTotalItem')
      displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
    } else {
      document.getElementById('displayTotalItem').textContent =
        'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
    }
    let errorMessage = document.getElementById('itemDetails')
    errorMessage.classList.remove('col-xl-6')
    errorMessage.className = 'overflow-auto text-center m-auto p-5'
    let singleItem = document.getElementById('item')
    // remove the section containing the image:
    singleItem.removeChild(errorMessage.previousElementSibling)
    errorMessage.innerHTML = 'No connection'
  })
}