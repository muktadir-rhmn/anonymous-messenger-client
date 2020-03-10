const time = {
    millisToTime: function(millis) {
        return new Date(parseInt(millis)).toUTCString();
    }
}

export default time;