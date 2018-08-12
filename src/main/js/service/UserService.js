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
}