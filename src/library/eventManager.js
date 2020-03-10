
const pullURL = "http://localhost:8080/listen";

class PullManager {
    constructor(pullURL) {
        this.pullURL = pullURL;
    }

    setEventManager(eventManager) {
        this.eventManager = eventManager;
    }

    pull() {
        const data = {
            lastEventTime: this.eventManager.lastEventTime,
            requestedEvents: [
                {
                    eventType: this.eventManager.eventTypes.NEW_MESSAGE,
                    data: {
                        lastMessageID: 7,
                    }
                },
            ]
        }
        this.sendRequestAndPullAgain(data);
    }

    sendRequestAndPullAgain(data) {
        this.xhr = new XMLHttpRequest();
        this.xhr.onreadystatechange = () => {
            if(this.xhr.readyState === XMLHttpRequest.DONE) {
                const response = JSON.parse(this.xhr.responseText);
                if(this.xhr.status === 200) {
                    this.handleEvents(response.events);
                } else {
                    console.error("Error while pulling", response)
                }
                setTimeout(() => this.pull(), 100); //pull again after a while
            }
        }
        this.xhr.open("POST", this.pullURL, true);
        this.xhr.setRequestHeader("Content-Type", "application/json");
        this.xhr.setRequestHeader("token", window.localStorage.getItem("token"));
        this.xhr.send(JSON.stringify(data));
    }

    handleEvents(events) {
        for(let i = 0; i < events.length; i++) {
            this.eventManager.handleNewEvent(events[i])
        }
    }

}

class EventManager {
    constructor() {
        this.eventListeners = {
            0: [],
        };

        this.eventTypes = {
            NEW_MESSAGE: 0,
        }

        this.lastEventTime = new Date().valueOf();
    }

    setPullManager(pullManager){
        this.pullManager = pullManager;
    }

    /**
     * 
     * @param eventType: int
     * @param handler: function(eventData)
     */
    addEventListener(eventType, handler) {
        this.eventListeners[eventType].push(handler);
    }

    handleNewEvent(event) {
        const handlers = this.eventListeners[event.eventType];

        let maxEventTime = -1;
        for(let i = 0; i < handlers.length; i++) {
            if(maxEventTime < event.createdAt) maxEventTime = event.createdAt; 
            handlers[i](event.data);
        }
        this.lastEventTime = maxEventTime;
    }
}

const pullManager = new PullManager(pullURL);
const eventManager = new EventManager();

eventManager.setPullManager(pullManager);
pullManager.setEventManager(eventManager);

const path = window.location.pathname;
if(path === "/" || path.indexOf("/initiator-message/") !== -1) pullManager.pull(); //start pulling

export default eventManager;