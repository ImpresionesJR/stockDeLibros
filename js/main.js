document.addEventListener('DOMContentLoaded', () => {
    const libros = JSON.parse(localStorage.getItem('libros')) || [];
    renderBooks(libros);
});

function searchBooks() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    let libros = JSON.parse(localStorage.getItem('libros')) || [];
    
    const librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(query));

    renderBooks(librosFiltrados);
}

document.getElementById('search-bar').addEventListener('input', searchBooks);

function formatTitle(title) {
    return title.replace(/\b\w/g, char => char.toUpperCase()); 
}

function uploadBook() {    
    const button = document.getElementById('cargar');
    
    button.addEventListener('click', (e) => {
        e.preventDefault();

        const bookInput = document.getElementById('libro');
        const cantidadInput = document.getElementById('cantidad');
        const tipoIngles = document.getElementById('ingles');
        const tipoVarios = document.getElementById('varios');

        let bookName = bookInput.value.trim();
        const cantidad = parseInt(cantidadInput.value.trim(), 10);
        
        let tipo = "";
        if (tipoIngles.checked) {
            tipo = "ingles";
        } else if (tipoVarios.checked) {
            tipo = "varios";
        }

        if (!bookName || isNaN(cantidad) || cantidad <= 0 || tipo === "") {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        // Formatear el título correctamente
        bookName = formatTitle(bookName);

        let libros = JSON.parse(localStorage.getItem('libros')) || [];

        // Buscar si el libro ya existe
        const existingBook = libros.find(libro => libro.titulo === bookName && libro.tipo === tipo);

        if (existingBook) {
            existingBook.cantidad += cantidad; // Sumar cantidad si el libro ya existe
        } else {
            libros.push({ titulo: bookName, cantidad, tipo });
        }

        libros.sort((a, b) => a.titulo.localeCompare(b.titulo)); // Ordenar alfabéticamente

        localStorage.setItem('libros', JSON.stringify(libros));              
        renderBooks(libros);
        
        bookInput.value = "";
        cantidadInput.value = "";
        tipoIngles.checked = false;
        tipoVarios.checked = false;
    });
}

function renderBooks(libros) {
    const containerIngles = document.getElementById('lista-libros-ingles');
    const containerVarios = document.getElementById('lista-libros');

    containerIngles.innerHTML = "<h2>Libros de Inglés</h2>";
    containerVarios.innerHTML = "<h2>Libros varios</h2>";

    libros.sort((a, b) => a.titulo.toLowerCase().localeCompare(b.titulo.toLowerCase()));

    let hasIngles = false;
    let hasVarios = false;

    libros.forEach((libro, index) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('box-libro');
        bookElement.innerHTML = `
            <p>${libro.titulo}</p>
            <span>${libro.cantidad}</span>
            <button onclick="editBook(${index})">Editar Cantidad</button>
            <button onclick="deleteBook(${index})">Eliminar</button>         
        `;

        if (libro.tipo === "ingles") { 
            containerIngles.appendChild(bookElement);
            hasIngles = true;
        } else if (libro.tipo === "varios") { 
            containerVarios.appendChild(bookElement); 
            hasVarios = true;
        }
    });

    if (!hasIngles) {
        const mensaje = document.createElement('p');
        mensaje.textContent = "No hay libros disponibles";
        containerIngles.appendChild(mensaje);
    }

    if (!hasVarios) {
        const mensaje = document.createElement('p');
        mensaje.textContent = "No hay libros disponibles";
        containerVarios.appendChild(mensaje);
    }
}

let currentEditIndex = null;

function editBook(index) {
    let libros = JSON.parse(localStorage.getItem('libros')) || [];
    currentEditIndex = index;

    // Mostrar el popup
    document.getElementById("popup").style.display = "flex";

    // Prellenar con la cantidad actual
    document.getElementById("new-quantity").value = libros[index].cantidad;
}

// Función para guardar cambios
document.getElementById("save-edit").addEventListener("click", () => {
    let libros = JSON.parse(localStorage.getItem('libros')) || [];
    let newQuantity = parseInt(document.getElementById("new-quantity").value, 10);

    if (!isNaN(newQuantity) && newQuantity >= 0) {
        libros[currentEditIndex].cantidad = newQuantity;
        
        // Si la cantidad es 0, eliminar el libro
        if (newQuantity === 0) {
            libros.splice(currentEditIndex, 1);
        }

        localStorage.setItem('libros', JSON.stringify(libros));
        renderBooks(libros);
        document.getElementById("popup").style.display = "none"; // Cerrar popup
    } else {
        alert("Cantidad inválida");
    }
});

// Cerrar el popup
document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
});

function deleteBook(index) {
    let libros = JSON.parse(localStorage.getItem('libros')) || [];
    libros.splice(index, 1);
    localStorage.setItem('libros', JSON.stringify(libros));
    renderBooks(libros);
}

function renderBooks(libros) {
    const containerIngles = document.getElementById('lista-libros-ingles');
    const containerVarios = document.getElementById('lista-libros');

    containerIngles.innerHTML = "<h2>Libros de Inglés</h2>";
    containerVarios.innerHTML = "<h2>Libros varios</h2>";

    libros.forEach((libro, index) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('box-libro');
        bookElement.innerHTML = `
            <p>${libro.titulo}</p>
            <span>${libro.cantidad}</span>
            <button onclick="editBook(${index})">Editar</button>
            <button onclick="deleteBook(${index})">Eliminar</button>
        `;

        if (libro.tipo === "ingles") {
            containerIngles.appendChild(bookElement);
        } else {
            containerVarios.appendChild(bookElement);
        }
    });
}

uploadBook();