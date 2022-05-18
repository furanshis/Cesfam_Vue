<template>
    <div class="page-pago">
        <div class="columns is-multiline">
            <h1 class="title">Proceso de pago</h1>
        </div>

        <div class="column is-12 box">
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Remedios</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in carrito.items"
                    v-bind:key="item.remedio.id">

                        <th>{{ item.remedio.nombreRemedio }}</th>
                        <th>{{ item.remedio.precioRemedio }}</th>
                        <th>{{ item.quantity }}</th>
                        <th>{{ getItemTotal(item) }}</th>

                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Total</td>
                        <td>{{ cartTotalLength }}</td>
                        <td>${{ cartTotalPrice }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="column is-12 box">
                <h2 class="subtitle">detalles del envio</h2>
                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>Nombre</label>
                            <div class="control">
                                <input type="text" class="input" v-model="nombre">
                            </div>
                        </div>

                        <div class="field">
                            <label>Apellido</label>
                            <div class="control">
                                <input type="text" class="input" v-model="apellido">
                            </div>
                        </div>

                        <div class="field">
                            <label>Correo</label>
                            <div class="control">
                                <input type="email" class="input" v-model="correo">
                            </div>
                        </div>

                        <div class="field">
                            <label>Teléfono</label>
                            <div class="control">
                                <input type="text" class="input" v-model="telefono">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Dirección</label>
                            <div class="control">
                                <input type="text" class="input" v-model="direccion">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <hr>

                <div id="card-element" class="mb-5"></div>

                <template v-if="cartTotalLength">
                    <hr>

                    <button class="button is-dark" @click="submitForm">Pagar</button>
                </template>

        </div>   
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "Pago",
    data() {
        return {
            carrito: {
                items: []
            },
            stripe: {},
            card: {},
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            direccion: '',
            errors: [],
        }
    },
    mounted() {
        document.title = 'Pago | Cesfam'

        this.carrito = this.$store.state.carrito

        if (this.cartTotalLength > 0){
            this.stripe = Stripe('pk_test_51Kze1cEGaM7Rr8Bph1nssQsm5c9DqVeKN96DRlI9OME9x4UBSQESI2V97nc5rbfbSFu4RmhfmgijOMBTJR9hebfD0016DqwRlz')
            const elements = this.stripe.elements();
            this.card = elements.create('card', { hidePostalCode: true })

            this.card.mount('#card-element')
        }
    },
    methods: {
        getItemTotal(item){
            return item.quantity * item.remedio.precioRemedio
        },
        submitForm(){
            this.errors = []

            if (this.nombre === ''){
                this.errors.push('Ingrese el nombre')
            }

            if (this.apellido === ''){
                this.errors.push('Ingrese el apellido')
            }

            if (this.correo === ''){
                this.errors.push('Ingrese el correo')
            }

            if (this.telefono === ''){
                this.errors.push('Ingrese el telefono')
            }

            if (this.direccion === ''){
                this.errors.push('Ingrese la dirección')
            }

            if (!this.errors.length) {
                console.log("setIsLoading")

                this.stripe.createToken(this.card).then(result =>{
                    if (result.error) {
                        this.errors.push("Algo salio mal con stripe. Vuelve a intentarlo")

                        console.log(result.error.message)
                    }else {
                        this.stripeTokenHandler(result.token)
                    }
                })
            }


        },
        stripeTokenHandler(token){
            const items = []

            for (let i = 0; i < this.carrito.items.length; i++){
                const item = this.carrito.items[i]
                const obj = {
                    remedio: item.remedio.id,
                    quantity: item.quantity,
                    precio: item.remedio.precioRemedio * item.quantity 
                }
                items.push(obj)
            }

            const data = {
                'nombre': this.nombre,
                'apellido': this.apellido,
                'correo': this.correo,
                'direccion': this.direccion,
                'telefono': this.telefono,
                'items': items,
                'stripe_token': token.id
            }

            axios
                .post('/api/v1/cobro/', data)
                .then(response => {
                    this.$store.commit('clearCart')
                    this.$router.push('/carrito/pago_finalizado')
                })
                .catch(error => {
                    this.errors.push('Algo salio mal. Vuelvelo a intentar')

                    console.log(error)
                })
        },
    },
    computed: {
        cartTotalLength(){
            return this.carrito.items.reduce((acc, curVal) => { ///la funcion reduce() de js nos permite hacer un loop en todos los items del carrito, para asi poder incrementar el valor
                return acc += curVal.quantity
            }, 0)
        },
        cartTotalPrice(){
            return this.carrito.items.reduce((acc, curVal) => { ///la funcion reduce() de js nos permite hacer un loop en todos los items del carrito, para asi poder incrementar el valor o el largo del carrito
                return acc += curVal.remedio.precioRemedio * curVal.quantity
            }, 0)
        },
    }
}
</script>