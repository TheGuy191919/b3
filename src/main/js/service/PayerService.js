import UserService from '../service/UserService';

export default class PayerService {

    static myInstance = null;

    static getInstance() {
        if (PayerService.myInstance == null) {
            PayerService.myInstance = new PayerService();
        }
        return this.myInstance;
    }

    constructor() {
        this.remotehost = "";
        if (window.location.port === "3000" ||
            window.location.port === "8081") {
            this.remotehost = "http://localhost:8080";
        }
    }

    createPayer(eventId, payer) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/event/" + eventId + "/payer", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(payer)
        })
        .then(res => res.json());
    }

    deletePayer(payerId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payer/" + payerId,{
            method: 'DELETE'
        });
    }

    putPayer(payer) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payer/" + payer.payerId, {
            method: 'put',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(payer)
        })
        .then(res => res.json());
    }

    getPayer(payerId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payer/" + payerId)
               .then(res => res.json());
    }
}