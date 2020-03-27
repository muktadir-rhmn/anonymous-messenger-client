import requester from "./requester";

const pullURL = "/listen";

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
                        lastMessageID: this.eventManager.lastMessageID,
                    }
                },
                {
                    eventType: this.eventManager.eventTypes.MESSAGE_SEEN,
                    data: {
                        
                    }
                },
                {
                    eventType: this.eventManager.eventTypes.TYPING,
                    data: {
                        
                    }
                }
            ]
        }
        this.sendRequestAndPullAgain(data);
    }

    sendRequestAndPullAgain(data) {
        requester.POST(this.pullURL, data).then(
            (response) => {
                this.handleEvents(response.events);
                this.pull();
            }, 
            (error) => {
                console.error("Error while pulling", error);
                this.pull();
            }
        )
    }

    handleEvents(events) {
        for(let i = 0; i < events.length; i++) {
            this.eventManager.handleNewEvent(events[i])
        }
    }

}

class EventManager {
    constructor() {
        
        this.eventTypes = {
            NEW_MESSAGE: 0,
            MESSAGE_SEEN: 1,
            TYPING: 2,
        }

        this.eventListeners = {};
        for(let eventName in this.eventTypes) {
            const eventType = this.eventTypes[eventName];
            this.eventListeners[eventType] = [];
        }

        this.lastEventTime = new Date().valueOf();
        this.lastMessageID = null;
        this.isPulling = false;
    }

    setPullManager(pullManager){
        this.pullManager = pullManager;
    }

    setLastMessageID(id) {
        console.log("Setting last message id:", id);

        this.lastMessageID = id;
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

        if(this.lastEventTime < event.createdAt) this.lastEventTime = event.createdAt; 
        
        for(let i = 0; i < handlers.length; i++) {
            handlers[i](event.data);
        }
    }

    startPulling() {
        if(this.isPulling) return;
        pullManager.pull(); 
        this.isPulling = true;
    }
}

const pullManager = new PullManager(pullURL);
const eventManager = new EventManager();

eventManager.setPullManager(pullManager);
pullManager.setEventManager(eventManager);

export default eventManager;