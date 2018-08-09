import UserService from '../service/UserService';

export default class EventService {

    static myInstance = null;

    static getInstance() {
        if (EventService.myInstance == null) {
            EventService.myInstance = new EventService();
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

    createEvent(event) {
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/event", {
            method: 'post',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(res => res.json());
    }

    deleteEvent(eventId) {
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/event/" + eventId,{
            method: 'DELETE'
        }).then(res => res.json());
    }

    putEvent(event) {
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/event/" + event.eventId, {
            method: 'put',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(res => res.json());
    }

    getEvent(eventId) {
        let token = UserService.getInstance().token;
        return fetch(this.remotehost + "/api/" + token + "/event/" + eventId)
               .then(res => res.json());
    }
}