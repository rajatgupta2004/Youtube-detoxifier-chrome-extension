// document.getElementById("filterButton").addEventListener("click", () => {
//     try {
//         const topic = document.getElementById("topic").value.trim();
//         if (!topic) {
//             alert("Please enter a topic.");
//             return;
//         }
//         // const tags = topic.split(" ");
//         // alert(tags);
//         alert(topic);
//         localStorage.setItem("tags2",'helllo hiii    broo');// Convert array to string
//         const tags = localStorage.getItem("tags2");
//         alert(tags);

//         console.log("Tags saved to localStorage:", tags);

//         Display a success message
//         const status = document.getElementById("status");
//         status.style.display = "block";
//         status.textContent = "Tags saved successfully!";
//     } catch (error) {
//         console.error("An error occurred:", error);
//         alert("An unexpected error occurred. Please try again.");
//     }
// });


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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: topic});
    });
}