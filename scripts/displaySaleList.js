let saleList = document.getElementById('saleList')
let loadingGif = document.getElementById('loadingGif')

// if there is Internet Connection:
if (navigator.onLine) {
  // Promise:
  const promise = new Promise((resolve, reject) => {
    let apiRequest = new XMLHttpRequest()
    apiRequest.open('GET', 'http://localhost:3000/api/teddies/')
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
  // if Promise resolve create for each item from the response an image with his name for the Carousel Slide:
  promise
    .then(response => {
      // remove loading gif:
      saleList.removeChild(loadingGif)
      let carouseControls = document.getElementById('carouselControls')
      // show the carousel after the loading gif is removed:
      carouseControls.removeAttribute('hidden')
      // for the first Carousel Item set the class active:
      for (i = 0; i < response.length; i++) {
        let carouselItem = document.createElement('div')
        if (i === 0) {
          carouselItem.className = 'carousel-item active'
        } else {
          carouselItem.className = 'carousel-item'
        }
        let carouselSlide = document.getElementById('carouselSlide')
        carouselSlide.appendChild(carouselItem)
        let carouselItemName = document.createElement('h2')
        carouselItemName.textContent = response[i].name
        carouselItemName.className = 'mb-3 my-3 my-md-5'
        carouselItem.appendChild(carouselItemName)
        let carouselItemLink = document.createElement('a')
        carouselItemLink.href = 'pages/singleItem.html' + '?' + response[i]._id
        carouselItem.appendChild(carouselItemLink)
        let carouselItemImage = document.createElement('img')
        carouselItemImage.className = 'border border-secondary'
        carouselItemImage.src = response[i].imageUrl
        carouselItemLink.appendChild(carouselItemImage)
      }
      // if the key 'totalitemincart' in localstorage is not set the basket show 0 as item in in cart otherwise show the value of the key 'totalitemincart' in the LocalStorage:
      if (localStorage.getItem('totalItemInCart') === null) {
        let displayTotalItemInCart = document.getElementById('displayTotalItem')
        displayTotalItemInCart.textContent = 'Cart' + ' ' + '(' + 0 + ')'
      } else {
        document.getElementById('displayTotalItem').textContent =
          'Cart' + ' ' + '(' + localStorage.getItem('totalItemInCart') + ')'
      }
      // if Promise doesn't resolve:
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
      // if it doesn't get response from server show 'Network Error' otherwise show the response from the server:
      if (!error) {
        saleList.className = 'm-auto overflow-auto p-5 text-center'
        saleList.innerHTML = 'Error: Network Error'
      } else {
        saleList.className = 'm-auto overflow-auto p-5 text-center'
        saleList.innerHTML = 'There is a problem with the backend'
      }
    })
  // if there is not connection to internet show error 'No Connection':
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
    saleList.className = 'p-5 text-center'
    saleList.innerHTML = 'No Connection'
  })
}