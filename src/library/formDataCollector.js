const formDataCollector = {
    collect: function(formID) {
        const data = {};

        const elements = document.querySelectorAll(`#${formID} .form-control`);
        for(let i = 0; i < elements.length; i++) {
            data[elements[i].id] = elements[i].value;
        }

        console.log("form Data:", data);
        return data;
    }
}

export default formDataCollector;