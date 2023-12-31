const notifier = require('node-notifier');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let eventos = [];
const eventosNotificados = [];
//
const actualizar = () => {
  rl.question('Desea actualizar algun evento ? si/no : ', (res) => {
    if (res == 'si') {
      console.log(eventos);
      rl.question('Escribe el nombre del evento a actualizar : ', (res) => {
        const index = eventos.findIndex(el => el.evento === res);
        if (index !== -1) { // Si el evento existe
          console.log(`Evento a actualizar : ${eventos[index].evento} , fecha establecida : ${eventos[index].fecha} , hora establecida : ${eventos[index].hora}`);
          rl.question('Nuevo nombre del evento : ', (res) => {
            eventos[index].evento = res;
            rl.question('Nueva fecha : ', (res) => {
              eventos[index].fecha = res;
              rl.question('Nueva Hora : ', (res) => {
                eventos[index].hora = res;
                console.log(eventos);
                console.log(`Evento actualizado ${eventos}`);
                SisteaNotificacion()
              });
            });
          });
        } else { // Si el evento no existe
          console.log('El evento no existe');
          console.log('Programa cerrado');
        }
      });
    } else {
      console.log('programa cerrado');
      rl.close();
    }
  });
};
//
const Eliminar = () => {
  rl.question('Desea cancelar algun evento ? si/no : ', (res)=>{
    if(res == 'si'){
      console.log(eventos)
      rl.question('Ingrese el nombre del evento a cancelar : ' , (res)=>{
        //
        eventos = eventos.filter(el => el.evento !== res)
        console.log(`El evento ha sido cancelado`)
        console.log(eventos)
        //
      })
    }else{
      actualizar()
    }
  })
}

//

 const Preguntas = () => {
  let agregarEvento = true;
  
   const realizarPregunta = () => {
    rl.question('¿Evento a recordar? ', (res) => {
      const evento = res;
      rl.question('Fecha a enviar recordatorio: ', (res) => {
        const fecha = res;
        rl.question('Hora a enviar recordatorio: ', (res) => {
          const hora = res;

          eventos.push({ evento, fecha, hora });
           console.log(`El evento ${evento} será recordado el día ${fecha}, a las ${hora}`);

           rl.question('Desea agregar otro evento a recordar? (si/no): ', (res) => {
            if (res.toLowerCase() === 'si') {
              realizarPregunta();
            } else {
              console.log('Programa cerrado');
              Eliminar()
              SisteaNotificacion();
            }
          });
        });
      });
    });
  };
   realizarPregunta();
};
//
 Preguntas();
 //
let intervalID = null;
 const SisteaNotificacion = () => {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
  const año = fechaActual.getFullYear();
  const fechaFormateada = `${dia}/${mes}/${año}`;

   const horaActual = new Date();

  const horas = horaActual.getHours();
  const min = horaActual.getMinutes();
  const horaFormateada = `${horas}:${min}`;

   eventos.forEach((evento) => {
    if (fechaFormateada === evento.fecha && horaFormateada === evento.hora) {
      clearTimeout(intervalID);
      Notificar(evento);
    } else if (fechaActual > new Date(`${evento.fecha} ${evento.hora}`)) {
      clearTimeout(intervalID);
    } else {
      const tiempoRestante = new Date(`${evento.fecha} ${evento.hora}`) - fechaActual;
      intervalID = setTimeout(() => {
        SisteaNotificacion();
      }, tiempoRestante);
    }
  });
};
 const Notificar = (evento) => {
  if (!eventosNotificados.includes(evento.evento)) {
    notifier.notify({
      title: `${evento.evento}`,
      message: `Es la hora de ${evento.evento}`,
      sound: true,
      wait: true,
    });
    eventosNotificados.push(evento.evento);
  }
};