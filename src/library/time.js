const time = {
    millisToTime: function(millis) {
        if(millis === null) return '-';
        return new Date(parseInt(millis)).toUTCString();
    }
}

export default time;