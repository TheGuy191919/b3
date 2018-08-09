import UserService from '../service/UserService';

export default class ItemService {

    static myInstance = null;

    static getInstance() {
        if (ItemService.myInstance == null) {
            ItemService.myInstance = new ItemService();
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

    createItem(eventId, item) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/event/" + eventId + "/item", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(res => res.json());
    }

    deleteItem(itemId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/item/" + itemId,{
            method: 'DELETE'
        }).then(res => res.json());
    }

    putItem(item) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/item/" + item.itemId, {
            method: 'put',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(res => res.json());
    }

    getItem(itemId) {
        if (!UserService.getInstance().validToken()) {
            return new Promise(function(resolve, reject) {
                resolve(null);
            });
        }
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/item/" + itemId)
               .then(res => res.json());
    }
}