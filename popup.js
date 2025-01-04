console.log("i am popup script");
let button = document.getElementById("filterButton");
button.addEventListener("click", clickFunction);
function clickFunction(){

    const topic = document.getElementById("topic").value;
    if (!topic) {
        alert("Please enter a topic.");
        return;
    }
    console.log(topic);
    chrome.storage.local.set({ "tags": topic }).then(() => {
        console.log("tags are set to chrome storage");
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: topic});
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Load the saved topic value
    chrome.storage.local.get(["tags"]).then((result) => {
        const topicInput = document.getElementById("topic");
        topicInput.value = result.tags || "";
    });

    chrome.storage.local.get(["isClicked"]).then((result) => {
        const checkbox = document.getElementById("checkbox");
        checkbox.checked = result.isClicked === "true";
    });

    chrome.storage.local.get(["isShorts"]).then((result) => {
        const checkbox = document.getElementById("shorts");
        checkbox.checked = result.isShorts === "true";
    });
    
});


document.getElementById("checkbox").addEventListener("change", function() {
    if (this.checked) {
        console.log("Checkbox is checked");
        chrome.storage.local.set({ "isClicked": "true" }).then(() => {
            console.log("Value is set true");
        });
    }else{
        console.log("Checkbox is unchecked");
        chrome.storage.local.set({ "isClicked": "false" }).then(() => {
            console.log("Value is set false");
        });
    }
});


document.getElementById("shorts").addEventListener("change", function() {
    if (this.checked) {
        console.log("shorts Checkbox is checked");
        chrome.storage.local.set({ "isShorts": "true" }).then(() => {
            console.log("shorts Value is set true");
        });
    }else{
        console.log("shorts Checkbox is unchecked");
        chrome.storage.local.set({ "isShorts": "false" }).then(() => {
            console.log("shorts Value is set false");
        });
    }
});
