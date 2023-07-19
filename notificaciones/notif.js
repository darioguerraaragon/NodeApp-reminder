const notifier = require('node-notifier');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const eventos = [];
const eventosNotificados = [];
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