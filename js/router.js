const Router= {
    routes : [],
    mode : null,
    root : '/',
    config : function(options) {
        this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash'
        this.root = options && options.root ? '/' + this.clearSlashes(options, root) + '/' : '/'
        return this
    },
    getFragment: function() {
        let fragment = ''
        if(this.mode === 'history'){
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search))
            fragment = fragment.replace(/\?(.*)$/)
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment
        } else {
            let match = window.location.href.match(/#(.*)$/)
            fragment = match ? match[1] : ''
        }
        return this.clearSlashes(fragment)
    },
    clearSlashes: function(path) {
        return path.toString().replace(/\/$/,'').replace(/^\//, '')
    },
    add: function(re, handler) {
        if(typeof re == 'function'){
            handler = re
            re = ''
        }
        this.routes.push({ re: re, handler: handler})
        return this
    },
    remove: function(param){
        for(let i=0; i<this.routes.length, r = this.routes[1]; i++){
            if(r.handler === param || r.re.toString() === param.toString()){
                this.routes.splice(i, 1)
                return this
            }
        }
        return this;
    },
    flush: function() {
        this.routes = []
        this.mode = null
        this.root = '/'
        return this
    },
    check: function(f){
        let fragment = f || this.getFragment()
        for(let i=0; i<this.routes.length; i++) {
            let match = fragment.match(this.routes[i].re)
            if(match) {
                match.shift();
                this.routes[i].handler.apply({}, match)
                return this
            }
        }
        return this
    },
    listen: function() {
        let self = this
        let current = self.getFragment()
        let fn = function() {
            if(current !== self.getFragment()) {
                current = self.getFragment()
                self.check(current)
            }
        }
        clearInterval(this.interval)
        this.interval = setInterval(fn, 50)
        return this
    },
    navigate: function(path) {
        path = path ? path : ''
        if(this.mode === 'history') {
            history.pushState(null, null, this.root + this.clearSlashes(path))
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path
        }
        return this
    }
}

// Configuración
Router.config({ mode: 'history' })

// Returning the user to the initial state
Router.navigate()


// Agregando rutas a nuestro router
Router.add(/login/, () => {
    document.body.classList.add('login-page')
    document.body.classList.remove('container')
    document.body.innerHTML = `
    <div class="login-container">
        <div class="brand-login">
            <img src="" alt="" class="logo">
        </div>
        <form class="form-login">
            <input type="text" class="form-login--user" placeholder="Usuario">
            <input type="password" class="form-login--pass" placeholder="Contraseña">
            <input type="submit" class="form-login--submit" value="Ingresar">
        </form>
        <a href="" id="linkRegistro">Registro</a>
    </div>
    `
    linkRegistro.addEventListener('click', e => {
        e.preventDefault()
        Router.navigate('/registro')
    })
    eventFormLogin()
}).add(/registro/, () => {
    document.body.classList.add('login-page')
    document.body.classList.remove('container')
    document.body.innerHTML = `
    <div class="login-container">
        <div class="brand-login">
            <img src="" alt="" class="logo">
        </div>
        <form class="form-registro">
            <input type="text" class="form-login--user" placeholder="Usuario">
            <input type="password" class="form-login--pass" placeholder="Contraseña">
            <input type="submit" class="form-login--submit" value="Registrarse">
        </form>
    </div>
    `
    eventFormRegister()
}).add(/chat/, () => {
    document.body.classList.add('container')
    document.body.classList.remove('login-page')
    document.body.innerHTML = `
    <aside class="sidebar-container">
        <div class="brand">
            <img src="" alt="" class="logo">
        </div>
        <div class="users">
            <h2>Usuarios conectados</h2>
            <div class="user">
                <span class="user--name">Jose Romero</span class="user--name">
                <span class="user--status">En línea</span class="user--status">
            </div>
            <div class="user">
                <span class="user--name">Francisco Zegarra</span>
                <span class="user--status">Ausente</span>
            </div>
            <div class="user">
                <span class="user--name">Jesus Casas</span>
                <span class="user--status">Ausente</span>
            </div>
            <div class="user">
                <span class="user--name">María Mayers</span>
                <span class="user--status">En línea</span>
            </div>
        </div>
        <div class="account">
            <a href="#" id="cerrar-sesion">Cerrar Sesión</a>
        </div>
    </aside>
    <main class="main-container">
        <div class="chat-details">
            <h1 class="title">Canal público</h1>
            <span class="sub-title">Sala general de comunicación</span>
        </div>
        <div class="messages-container" id="messages-container">
            
        </div>
        <div class="form-container">
            <form class="message-form">
                <input class="message-form--text" type="text" autocomplete="off" placeholder="Ingrese su mensaje">
                <input class="message-form--submit" type="submit" value="Enviar">
            </form>
        </div>
    </main>
    `
    document.getElementById('cerrar-sesion').addEventListener('click', e => {
        localStorage.clear()
        Router.navigate('/login')
    })
}).listen()

if(localStorage.getItem('token') === 'ESTEDEBESERELTOKEN'){
    Router.navigate('/chat')
} else {
    Router.navigate('/login')
}