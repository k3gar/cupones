new Vue({
  data(){
    return {
      estado: false,
      promos: [],
      promosFiltradas: [],
      clickedPromoId: null,
      contador: 0,
      /* endDate: new Date('2023-12-02T00:00:00.000Z').getTime(), */
      /* now: new Date().getTime(), */

    }
  },
  methods:{
    getImageUrlStrapi(image){
      const img = image.attributes.main_logo.data.attributes.url;
      
      return 'https://dev-strapi-6369.onrender.com' + img
    },
    
    toggleDetails(promoId) {
      if (this.clickedPromoId === promoId) {
        this.clickedPromoId = null; // Si ya se hizo clic, oculta los detalles
      } else {
        this.clickedPromoId = promoId; // Si no se hizo clic, muestra los detalles
      }
    },
    getPromoCountdown() {
      const endDate = new Date('2023-12-02T06:00:00.000Z').getTime();
      const now = new Date().getTime();
      const timeRemaining = endDate - now;
      // Verificar si la fecha actual es antes de la fecha de finalización
      if (now < endDate) {
        // Calcular horas, minutos y segundos
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        // Si la fecha actual es después de la fecha de finalización, no mostrar el contador
        return null;
      }
    }

  },

  mounted(){

    fetch('https://strapi-master-prd-redis-eqjekncm6q-ue.a.run.app/api/advientos?populate=*')
    .then(response => response.json())
    .then(data => {
      //If the state is equal to true, and validate the start and end date of the promotion.
      //this.promos = data.data.filter((promo) => promo.attributes.Estado == true && promo.attributes.FechaInicio <= new Date().toISOString().split('T')[0] && promo.attributes.FechaFinaliza >= new Date().toISOString().split('T')[0]),
    
      //Where the state is equal to true, only the active promotions are filtered and saved
      this.promos = data.data[0].attributes.cards,

      this.promos.length > 0
        ? (
            this.estado = true,
            
            //The promotions are filtered and saved in clean array
            this.promosFiltradas = this.promos.map((promo ) => {
                return {
                id: promo.id,
                startDate: promo.start_date,
                endDate: promo.end_date,
                /* imagePromotion: 'https://dev-strapi-6369.onrender.com' + promo.attributes.main_logo.data.attributes.url, */
                // Nuevos campos
/*                 cardTitle: promo.attributes.cards[0].title,
                cardDescription: promo.attributes.cards[0].description,
                cardStartDate: promo.attributes.cards[0].start_date,
                cardEndDate: promo.attributes.cards[0].end_date,
                cardIsVisible: promo.attributes.cards[0].isVisible,
                cardCoupon: promo.attributes.cards[0].coupon, */
                }

            }) 
          )
        : this.estado = false
      //For debugging
      //console.log(this.promosFiltradas)
      //console.log(this.estado)
    })

    setInterval(() => {
      this.now = new Date().getTime();
      this.contador = this.getPromoCountdown();
      this.$forceUpdate(); // Forzar la actualización de Vue
    }, 1000);

  },

}).$mount('#app')