import cookie from 'react-cookies';

export default class UserService {

    static myInstance = null;

    static getInstance() {
        if (UserService.myInstance == null) {
            UserService.myInstance = new UserService();
        }
        return this.myInstance;
    }

    constructor() {
        this.token = cookie.load('token') || null;
        let date = cookie.load('token_time') || 0;
        if (parseInt(date) + Math.min(Number.MAX_SAFE_INTEGER,2500000000) < Date.now()) {
          this.token = null;
          cookie.remove('token', {path: "/"});
          cookie.remove('token_time', {path: "/"});
        }
        this.tokenDate = null;
        this.user = null;
        this.userDate = null;
        this.remotehost = "";
        if (window.location.port === "3000" ||
            window.location.port === "8081") {
            this.remotehost = "http://localhost:8080";
        }
    }

    register(user) {
        return fetch(this.remotehost + "/api/user", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.text())
        .then(token => {
            if (token === null || token === "") {
                return null;
            }
            this.token = token;
            cookie.save('token', token, {path: "/"});
            cookie.save('token_time', Date.now(), {path: "/"});
            this.tokenDate = new Date();
            return token;
        });
    }

    login(user) {
        return fetch(this.remotehost + "/api/user/login", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.text())
        .then(token => {
            if (token === null || token === "") {
                return null;
            }
            this.token = token;
            cookie.save('token', token, {path: "/"});
            cookie.save('token_time', Date.now(), {path: "/"});
            this.tokenDate = new Date();
            return token;
        });
    }

    logout() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/logout", {
            method: 'post'
        }).then(() => {
            this.token = null;
            this.user = null;
            cookie.remove('token', {path: "/"});
            cookie.remove('token_time', {path: "/"});
        });
    }

    changePassword(user) {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/changePassword", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    validToken() {
        return this.token !== null;
    }

    updateUser(user) {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/" + user.userId, {
            method: 'put',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json()).then((user) => {
            this.user = user;
            this.userDate = Date.now();
            return user;
        });
    }

    currentUser() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        if (this.user !== null && this.userDate + 600000 > Date.now()) {
            return new Promise((resolve, reject) => {
                resolve(this.user);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user?token=" + this.token)
            .then(res => res.json()).catch(() => {return null;}).then((user) => {
                this.user = user;
                this.userDate = Date.now();
                return user;
            });
    }

    getEventForUser() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/event")
               .then(res => res.json());
    }

    getPayerPaymentForUser() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/payer")
               .then(res => res.json());
    }

    getPayeePaymentForUser() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/payee")
               .then(res => res.json());
    }

    searchUserByHandle(handle) {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user?handle=" + handle)
               .then(res => res.json());
    }

    getSuggestion() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user/suggestion")
               .then(res => res.json());
    }
}