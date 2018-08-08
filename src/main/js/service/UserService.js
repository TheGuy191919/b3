class UserService {

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
        if (window.location.port === "3000") {
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
}