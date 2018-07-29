const eventChange = require('../constant').eventChange;

var getDateMonthString = (dateTime) => {
    // toUTCString() : 'Wed, 25 Jul 2018 19:04:00 GMT'
    var month = dateTime.toUTCString().split(' ')[2];
    var day = dateTime.getUTCDate();
    var weekDay = dateTime.toUTCString().split(',')[0];
    return `${weekDay} ${day} ${month}`
};
var getTimeString = (dateTime) => {
    var hour = dateTime.getUTCHours().toString(), min = dateTime.getUTCMinutes().toString();min
    return `${hour.padStart(2,'0')}:${min.padStart(2,'0')}`;
};

function NRCEvent(id, name, capacity, regCount, location, startDate, endDate, openDate, closeDate) {
    this.id = id;                       // Event ID
    this.name  = name;                  // Event Name ex. 'NRCBKK READY SET GO RUN 5K'
    this.capacity = capacity;           // Max Capacity
    if (regCount > capacity) {
        throw new RangeError('regCount should not be more than capacity.')
    }
    this.regCount = regCount;           // Number of Registered Users
    this.location = location;           // Location Description 
    this.startDate = new Date(startDate);         // Start Running Date (epoch)      
    this.endDate = new Date(endDate);             // End Running Date (epoch)      
    this.openDate = new Date(openDate);           // Open Registration Date (epoch)  
    this.closeDate = new Date(closeDate);         // Close Registration Date (epoch)
    // Generated properties
    this.eventDate = getDateMonthString(this.startDate);    // Event Date       ex. '25 July'
    this.startDateTime = getTimeString(this.startDate);     // Event Start Time ex. '19.04'
    this.endDateTime = getTimeString(this.endDate);         // Event End Time   ex. '20.30'
    this.regDate = getDateMonthString(this.openDate);       // Registration Date ex. '19 July'
    this.regDateTime = getTimeString(this.openDate);        // Registration Time ex. '20.30'
};

/**
 * Convert instance to a string.
 */
NRCEvent.prototype.toString = function () {
    var eventString = `Event: ${this.name}\n` +
                      `Registerd: ${this.regCount}/${this.capacity}\n` +
                      `Open date: ${this.regDate} ${this.regDateTime}\n` +
                      `Run date: ${this.eventDate} ${this.startDateTime}-${this.endDateTime}\n`
    return eventString;
};

/**
 * Check if event is full.
 */
NRCEvent.prototype.isFull = function() {
    return this.regCount == this.capacity ;
};

/**
 * Check if event is almost full.
 */
NRCEvent.prototype.isAlmostFull = function() {
    var freeSlot = this.capacity - this.regCount;
    return freeSlot != 0 && freeSlot <= 5  ;
};

/**
 * Static. Compare new event with previous one. 
 */
NRCEvent.prototype.compareChange = function (event1, event2) {
    if (!event1.isFull() && event2.isFull()){
        return eventChange.FULL;
    } else if (event1.isFull() && !event2.isFull()){
        return eventChange.FREE_SLOT;
    } else if (!event1.isAlmostFull() && event2.isAlmostFull()){
        return eventChange.ALMOST_FULL;
    }
    return eventChange.NO_CHANGE;
};

/**
 * Static. 
 */
NRCEvent.prototype.fromJSON = function (jsonEvent) {
    var {
        id,
        name,
        capacity,
        registrationCount,
        meetingPointDescription,
        meetingPointDescription2,
        headline,
        subHeadline1,
        startDate,
        endDate,
        openDate,
        closeDate
    } = jsonEvent;
    var location = meetingPointDescription + meetingPointDescription2;
    var eventName = `${headline} ${name} (${subHeadline1})`
    return new NRCEvent(id, eventName, capacity, registrationCount, location, startDate, endDate, openDate, closeDate);
};

module.exports = NRCEvent;