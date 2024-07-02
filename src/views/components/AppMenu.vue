<template>
  <div class="">
  <nav class="navbar navbar-expand-lg navbar-dark fondobet">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="@/assets/img/logos/logo-betgol.webp" alt="Logo" class="logo d-inline-block align-text-top">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav menu bordermenu ">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">
              <img src="@/assets/img/icons/pagina-de-inicio.svg" alt="Inicio" class="nav-icon">Inicio
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <img src="@/assets/img/icons/regalo.svg" alt="Inicio" class="nav-icon">Premios
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <img src="@/assets/img/icons/rubi.svg" alt="Inicio" class="nav-icon"> Ganadores
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <img src="@/assets/img/icons/trofeo.svg" alt="Inicio" class="nav-icon"> Nosotros
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <img src="@/assets/img/icons/pregunta.svg" alt="Inicio" class="nav-icon"> Preguntas Frecuentes
            </a>
          </li>
        </ul>
        <div class="d-flex mt-3">
          <a class="btn btn-suscribirse me-2" href="#">Suscribirse</a>
          <a class="btn btn-outline-light" href="#">Iniciar Sesión</a>
        </div>
      </div>
    </div>
  </nav>
</div>
</template>

<script setup>
// Aquí puedes añadir cualquier lógica específica de Vue si la necesitas
</script>

<style scoped>
li:hover{
  background-color: #008AE5;
  border-radius: 10px;
  border: 1px solid #83F5FF;
}
.fondobet {
  background-color: #0E133B;
}

.bordermenu {
  background-color: #0F152B;
  padding: 5px 0px;
  margin: 0px 40px;
  border-radius: 20px;
  border: 3px solid #4F5F90;
}

.navbar-brand img {
  height: auto;
  max-height: 80px;
  width: auto;
}

.btn-suscribirse {
  background-color: #5615FF;
  color: white;
  border: 3px solid #83F5FF;
}
.btn-suscribirse:hover {
  background-color: #07E536;
  color: #221617;
  border: 3px solid #221617;
}

.btn-outline-light {
  color: #fff;
  border-color: #6f42c1;
}

.nav-link i {
  margin-right: 5px;
}

/* Centrar el menú y ajustar el espacio entre elementos */
.menu {
  display: flex;
  justify-content: center;
  width: 65%;
}

.menu .nav-item {
  margin: 0 15px; /* Espacio entre los elementos */
}
.nav-link {
  display: flex;
  align-items: center;
}
.nav-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  vertical-align: middle;
}
/* Ajustar el espacio entre elementos en función del tamaño de la pantalla */
@media (max-width: 992px) {
  .menu .nav-item {
    margin: 0 10px;
  }
}

@media (max-width: 768px) {
  .menu {
    flex-direction: column;
    align-items: center;
  }
  .menu .nav-item {
    margin: 10px 0;
  }
}
</style>
