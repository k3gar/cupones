new Vue({
  data(){
    return {
      estado: false,
      promos: [],
      promosFiltradas: [],
      promosFiltradasSV: [],
      promosFiltradasGT: [],
      promosFiltradasNI: [],
      promosFiltradasCR: [],
      clickedPromoId: null,
      contador: 0,

    }
  },
  methods:{
    toggleDetails(promoId, startDate, endDate) {
      const isActiveToday = this.isPromoActive(startDate, endDate).isActive;
      
      if (this.clickedPromoId === promoId && isActiveToday) {
        this.clickedPromoId = null; // Si ya se hizo clic y está activa hoy, oculta los detalles
      } else {
        this.clickedPromoId = isActiveToday ? promoId : null; // Si está activa hoy, muestra los detalles
      }
    },
    getPromoCountdown(startDate, endDate) {
      const now = new Date().getTime();
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
  
      // Verificar si la fecha actual está entre la fecha de inicio y la fecha de fin
      if (now >= startDateTime && now <= endDateTime) {
        const timeRemaining = endDateTime - now;
  
        // Calcular horas, minutos y segundos
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
        return `${hours}h ${minutes}m ${seconds}s`;
      } else {
        // Si la fecha actual está fuera del rango de la promoción, no mostrar el contador
        return null;
      }
    },
    isPromoActive(startDate, endDate) {
      const now = new Date().getTime();
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
    
      // Verificar si la fecha actual está dentro del rango de la promoción
      const isActive = now >= startDateTime && now <= endDateTime;
    
      // Verificar si la promoción ha finalizado
      const hasEnded = now > endDateTime;
    
      // Verificar si falta menos de 24 horas para la finalización
      const hoursRemaining = (endDateTime - now) / (1000 * 60 * 60);
      const isWithin24Hours = hoursRemaining < 24 && hoursRemaining > 0; // Cambiado aquí
    
      return { isActive, hasEnded, isWithin24Hours };
    }
  
  },

  mounted() {
    fetch('https://strapi-master-prd-redis-eqjekncm6q-ue.a.run.app/api/advientos?populate[0]=*&populate[1]=backgrounds.bg_media&populate[2]=backgrounds.bg_media_mobile&populate[3]=cards&populate[4]=cards.product_image&populate[5]=cards.cover_image&populate[6]=cards.bg_image&populate[7]=region_settings&populate[8]=main_logo')
      .then(response => response.json())
      .then(data => {
        // Asumiendo que cada elemento en data.data es un país con sus propias cards
        const promosPorPais = data.data;

        // Obtener información de cada país
        this.promosFiltradas = promosPorPais.map(pais => {
          const cards = pais.attributes.cards || [];
          
          const promos = cards.map(promo => {
            const productImageData = promo.product_image.data;
            return {
              id: promo.id,
              title: promo.title,
              description: promo.description,
              startDate: promo.start_date,
              endDate: promo.end_date,
              coupon: promo.coupon,
              coverImage: promo.cover_image.data.attributes.url,
              productImage: productImageData ? productImageData.attributes.url : "https://siman.vtexassets.com/assets/vtex.file-manager-graphql/images/a2cc640d-04c5-4d7c-94a4-3e96fb18daa1___ab337472217644aad78268909ac9c42e.svg",
            };
          });

          // Filtrar solo los países con promociones
          if (promos.length > 0) {
            this.estado = true;

            // Organizar promociones en arrays diferentes según el país
            switch (pais.id) {
              case 1: // SV
                this.promosFiltradasSV = promos;
                break;
              case 2: // GT
                this.promosFiltradasGT = promos;
                break;
              case 3: // NI
                this.promosFiltradasNI = promos;
                break;
              case 4: // CR
                this.promosFiltradasCR = promos;
                break;
              // Puedes agregar más casos según sea necesario
            }
          }

          return {
            idPais: pais.id,
            promos,
          };
        });

        console.log(this.promosFiltradasSV, "SV")
      });



    setInterval(() => {
      this.now = new Date().getTime();
      this.contador = this.getPromoCountdown();
      this.$forceUpdate(); // Forzar la actualización de Vue
    }, 1000);

  },

}).$mount('#app')