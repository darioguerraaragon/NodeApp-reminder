const notifier = require('node-notifier');  
const readline = require('readline');  
   
const rl = readline.createInterface({  
  input: process.stdin,  
  output: process.stdout  
});  
  
// Preguntar   
const Preguntas = () => { 
    rl.question('¿Evento a recordar? ', (res) => {  
    const evento = res  
    //  
    rl.question('fecha a enviar recordatorio : ', (res)=>{  
        const fecha = res  
        //  
        rl.question('Hora a enviar recordatorio : ', (res)=>{  
            const hora = res  
            console.log(evento , fecha , hora)  
                //  
            console.log(`El evento ${evento} sera recordado el dia ${fecha} , a las ${hora}`)     
            SisteaNotificacion(evento , hora , fecha) 
             
            rl.question('Desea agregar otro evento a recordar ? : si/no ' , (res)=>{ 
                if(res == 'si'){ 
                    Preguntas() 
                }else{ 
                    console.log('Programa cerrado') 
                } 
            }) 
        })      
    })  
})  
} 
Preguntas() 
//  
let intervalID = null  
const SisteaNotificacion = (evento , hora , fecha) => {  
    const fechaActual = new Date();  
    const dia = fechaActual.getDate();  
    const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript comienzan desde 0  
    const año = fechaActual.getFullYear();  
    const fechaFormateada = `${dia}/${mes}/${año}`;  
    //horas  
    const horaActual = new Date();  
    const horas = horaActual.getHours();  
    const min = horaActual.getMinutes();  
    const horaFormateada = `${horas}:${min}`  
    //  
    const Notificar = () => {  
        notifier.notify({  
            title: `${evento}`,  
            message: `es la hora de ${evento}`,  
            // icon: 'ruta/a/una/imagen.png', // Ruta a una imagen para el ícono de la notificación  
            sound: true, // Reproducir un sonido de notificación  
            wait: true, // Esperar a que el usuario cierre la notificación antes de continuar  
        });  
    }  
    // cuando enviar la notificacion  
      if (fechaFormateada === fecha && horaFormateada === hora) {  
      clearTimeout(intervalID);  
      return Notificar();  
  
      } else if (fechaActual > fecha && horaActual > hora) {  
          return clearTimeout(intervalID);  
      }  
     
    const tiempoRestante = new Date(`${fecha} ${hora}`) - fechaActual; 
       
     intervalID = setTimeout(() => {   
          SisteaNotificacion(evento, fecha, hora);  
      }, tiempoRestante);  
} 