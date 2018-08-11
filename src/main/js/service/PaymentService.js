import UserService from '../service/UserService';

export default class PaymentService {

    static myInstance = null;

    static getInstance() {
        if (PaymentService.myInstance == null) {
            PaymentService.myInstance = new PaymentService();
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

    createPayment(payment) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payment", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(payment)
        })
        .then(res => res.json());
    }

    deletePayment(paymentId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payment/" + paymentId,{
            method: 'DELETE'
        });
    }

    putPayment(payment) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payment/" + payment.paymentId, {
            method: 'put',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(payment)
        })
        .then(res => res.json());
    }

    getPayment(paymentId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/payment/" + paymentId)
               .then(res => res.json());
    }
}