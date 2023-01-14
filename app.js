const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templatecARD = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let = carrito = {}

document.addEventListener('DOMContentLoaded', e => {
    fetchData()

   /* if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }*/
   
});


  cards.addEventListener("click",e => {
    addCarrito(e)
    Toastify({
        text: "Se agrego su producto correctamente!!",
        offset: {
          x: 50, // horizontal 
          y: 10 // vertical 
        },
      }).showToast();
  })

  items.addEventListener("click", e => {botonAccion(e)})

/*items.addEventListener("click", e => {('btn-info(e)')
Toastify({
    text: "Se sumo un producto existente",
    offset: {
      x: 50, // horizontal 
      y: 10 // vertical 
    
    },
    style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
  }).showToast();
})*/

/*items.addEventListener("click", e => {("btn-danger(e)")
Toastify({
    text: "Producto eliminado",
    offset: {
      x: 50, // horizontal 
      y: 10 // vertical 
    
    },
    style: {
        background: "linear-gradient(to right, #990000, #9900CC)",
      },
  }).showToast();
})*/

  
  const fetchData = async () => {
    try {
      const res = await fetch("stock.json")
      const data = await res.json()
      //console.log(data)
      pintarCards(data)
    } catch (error) {
      console.log(error)
    }
  }

const pintarCards = data => {
    //console.log(data)
    data.forEach(producto => {
        templatecARD.querySelector("h5").textContent = producto.title
        templatecARD.querySelector("p").textContent = producto.precio
        templatecARD.querySelector("img").setAttribute("src", producto.thumbnailUrl)
        templatecARD.querySelector(".btn-dark").dataset.id = producto.id
        const clone = templatecARD.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target.classList.contains("btn-dark"))
    if(e.target.classList.contains("btn-dark")){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {

const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
        //producto.cantidad++
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
            carrito = {}
            pintarCarrito()
    })
}

const botonAccion = e => {

    if (e.target.classList.contains('btn-info')) {
        Toastify({
            text: "Se sumo un producto existente",
            offset: {
              x: 50, // horizontal 
              y: 10 // vertical 
            
            },
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
          }).showToast();
        
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
        
    }
    if (e.target.classList.contains('btn-danger')) {
        {Toastify({
            text: "Producto eliminado",
            offset: {
              x: 50, // horizontal 
              y: 10 // vertical 
            
            },
            style: {
                background: "linear-gradient(to right, #990000, #9900CC)",
              },
          }).showToast();}
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

