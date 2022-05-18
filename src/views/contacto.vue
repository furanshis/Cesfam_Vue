<template>

  <body>

    <!--formulario de contacto  -->

    <div class="card p-3">
      <div class="flex-column">
        <h1>Contacto</h1>


        <form @submit.prevent="enviarCorreo">
          <div class="field">
            <label>Su nombre*</label>
            <div class="control">
              <input type="text" class="input" v-model="nombre">
            </div>
          </div>
          <div class="field">
            <label>Su e-mail*</label>
            <div class="control">
              <input type="text" class="input" v-model="correo">
            </div>
          </div>
          <div class="field">
            <label>Asunto*</label>
            <div class="control">
              <input type="text" class="input" v-model="asunto">
            </div>
          </div>
          <div class="field">
            <label>Mensaje*</label>
            <div class="control">
              <input type="text" class="input" v-model="mensaje">
            </div>
          </div>

          <div class="notification is-danger" v-if="errors.length">
                <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
            </div>
          
          <div class="field">
            <div class="control">
              <button type="submit" class="btn btn-primary">Enviar</button>
            </div>
          </div>
            
         

        </form>
      </div>

    </div>
  </body>

</template>

<script>
import axios from 'axios'
export default {
  name: 'contacto',
  data() {
    return {
      nombre : '',
      correo: '',
      asunto: '',
      mensaje: '',
      errors: []
    }
  },
  mounted() {
    document.title = 'Contacto | Cesfam'
  },
  methods: {
    enviarCorreo() {
      this.errors = []

      if (this.nombre === '' ) {
        this.errors.push("Ingrese el nombre")
      }
      if (this.correo === '') {
        this.errors.push("Ingrese el correo")
      }
      if (this.asunto === '') {
        this.errors.push("Ingrese el asunto")
      }
      if (this.mensaje === '') {
        this.errors.push("Ingrese el mensaje")
      }

      if (!this.errors.length){
        console.log("Se está enviando el correo")
        
        axios.post("http://127.0.0.1:8000/api/v1/correo/", {
          nombre: this.nombre,
          correo: this.correo,
          asunto: this.asunto,
          mensaje: this.mensaje
        }, {
        headers: {'Content-Type': 'application/json'}
        }).then(function(response) {
          console.log(response);
        }).catch(function(error) {
          console.log(error);
        })
        
      }
    }

  },
}
</script>