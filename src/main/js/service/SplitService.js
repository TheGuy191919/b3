import UserService from '../service/UserService';

export default class SplitService {

    static myInstance = null;

    static getInstance() {
        if (SplitService.myInstance == null) {
            SplitService.myInstance = new SplitService();
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

    createSplit(itemId, split) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/item/" + itemId + "/split", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(split)
        })
        .then(res => res.json());
    }

    deleteSplit(splitId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/split/" + splitId,{
            method: 'DELETE'
        });
    }

    putSplit(split) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/split/" + split.splitId, {
            method: 'put',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(split)
        })
        .then(res => res.json());
    }

    getSplit(splitId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/split/" + splitId)
               .then(res => res.json());
    }
}