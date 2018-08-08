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
        this.remotehost = "";
        if (window.location.port === "3000" ||
            window.location.port === "8081") {
            this.remotehost = "http://localhost:8080";
        }
    }

    register(user) {
        return fetch("/api/user", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    login(user) {
        return fetch("/api/user/login", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    currentUser() {
        if (this.token === null) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        return fetch("/api/" + this.token + "/user?token=" + this.token)
               .then(res => res.json());
    }
}