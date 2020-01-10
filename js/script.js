const c = console.log

const apiURL = 'http:/localhsot/api'
const apiRegister = apiURL + '/v1/register'
const apiLogin = apiURL + '/v1/login'

const prepareRegister = async user => {
    const data = await executeService(apiRegister, 'POST', user)
    return data
}

const prepareLogin = async user => {
    const data = await executeService(apiLogin, 'POST', user)
    if (data.type === 'ok'){
        localStorage.setItem('token', data.data)
        console.log('token guardado')
        return data
    }
}

const executeService = async (uri, met, user) => {
    const header =  new Headers
    header.append('Content-Type', 'application/json')

    const myInit = {
        method : met,
        headers : header,
        body : JSON.stringify(user)
    }

    const resp = await fetch(uri, myInit)
    const json = await resp.json()
    return json
}


// prepareRegister()
prepareLogin()

const mensajeImpreso = data => {
    let contenido = `
    <div class="message">
        <div class="message--avatar">
            <img src="" alt="">
        </div>
        <div class="message--info">
            <div class="message--user">
                <span class="message--user_name">${data.from}</span>
                <span class="message--user_time">${new Date() / 1000}</span>
            </div>
            <div class="message--content">
                ${data.data}
            </div>
        </div>
    </div>
   `   
   if(data.data) {
       let element = document.getElementById('message-container')
       element.innerHTML = element.innerHTML + contenido
   }
}

const user1 = 'Jose'
const token1 = localStorage.getItem('token')
const wsURL = `ws://localhost/ws?nick=${user1}&token=${token1}`
// WebSocket
const ws = new WebSocket(wsURL)
ws.onopen = () => {c('Se ha establecido conexión con el websocket')}
ws.onerror = error => {c(error)}
ws.onmessage = mensaje => {
    c(mensaje.data)
    mensajeImpreso(JSON.parse(mensaje.data))
}

const eventForm1 = () => {
    const form1 =  document.getElementById('message-form')
    if(form1){
        form1.addEventListener('submit', e => {
            e.preventDefault()
            let mensajeEscrito = e.target.messageText.value
            let mensajeParaEnviar = {
                type : 'Mensaje',
                data : mensajeEscrito
            }
            ws.send(JSON.stringify(mensajeParaEnviar))
            e.target.messageText.value = ''
        })
    }
}

const eventFormRegister = () =>{
    const formRegister = document.getElementById('form-registro')
    if(formRegister){
        formRegister.addEventListener('submit', e => {
            e.preventDefault()
            const user = {
                nick_name: e.target.userName.value,
                password: e.target.usarPass.value
            }
            prepareRegister(user)
                .then(data => {
                    console.log(data)
                    formRegister.innerHTML = `
                        <p>usted ha sido registrado exitosamente ahora puede iniciar sesión</p>
                        <a href="#" id="linkLogin">Iniciar Sesión</a>
                    `
                    linkLogin.addEventListener('click', e => {
                        e.preventDefault()
                        Router.navigate('/login')
                    })
                })
        })
    }
}

const eventFormLogin = () => {
    const formLogin = document.getElementById('form-login')
    if(formLogin) {
        formLogin.addEventListener('submit', e => {
            e.preventDefault()
            let user = {
                nick_name: e.target.userName.value,
                password: e.target.userPass.value
            }
            prepareLogin(user)
                .then(data => { 
                    if(data.type == 'ok'){
                        Router.navigate('/chat')
                    }   
                }).catch(e => {
                    console.log(e)
                })
        })
    }
}