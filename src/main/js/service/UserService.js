export default class UserService {

    static myInstance = null;

    static getInstance() {
        if (UserService.myInstance == null) {
            UserService.myInstance = new UserService();
        }
        return this.myInstance;
    }

    constructor() {
        this.token = null;
        this.tokenDate = null;
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
            this.tokenDate = new Date();
            return token;
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
        .then(res => res.json());
    }

    currentUser() {
        if (!this.validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch(this.remotehost + "/api/" + this.token + "/user?token=" + this.token)
               .then(res => res.json());
    }
}