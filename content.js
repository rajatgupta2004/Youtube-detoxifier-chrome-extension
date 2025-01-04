let removingVideos = false;
const observer = new MutationObserver(function (mutations) {
    let shouldRun = false;

    // Check if any mutation is relevant
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
            shouldRun = true;
        }
    });
    if (shouldRun && !removingVideos) {
        removeRecommendedVideos();
    }
});

async function isVideoGood(video, tags) {
    try {
        const data = await fetch(`http://localhost:3001/data?videoUrl=${video}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tags: tags }),
        });

        const json = await data.json();
        console.log("Video:", video);
        console.log(json.result);

        console.log(json);
        if (json.result === "NO\n") {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error("Error checking video:", error);
        return false;
    }
}

function getVideoTitle(video) {
    const titleElement = video.querySelector('#video-title');
    return titleElement ? titleElement.textContent.trim() : 'Unknown Title';
}

async function removeRecommendedVideos() {
    if (removingVideos) return;
    removingVideos = true;

    const recommendedSection = document.querySelector('#secondary');

    if (recommendedSection) {
        observer.disconnect(); // Temporarily stop observing

        const recommendedVideos = recommendedSection.querySelectorAll('ytd-compact-video-renderer, ytd-video-renderer');
        for (const video of recommendedVideos) {
            const videoLink = video.querySelector('a').href;
            const videoTitle = getVideoTitle(video).split(" ");
            for (let i = 0; i < videoTitle.length; i++) {
                videoTitle[i] = videoTitle[i].toLowerCase();
            }

            const tags = localStorage.getItem("tags").split(" ");

            let flg = 0;
            for (let i = 0; i < tags.length; i++) {
                if (videoTitle.includes(tags[i].toLowerCase())) {
                    video.style.display = 'block'; // Example action for good videos
                    flg = 1;
                    break;
                }
            }
            if (flg) {
                continue;
            }
            const response = await isVideoGood(videoLink, tags);
            if (!response) {
                video.style.display = 'none'; // Example action for bad videos
            }
        }

        observer.observe(document.body, { childList: true, subtree: true }); // Reconnect the observer
    } else {
        console.log("Recommended videos section not found.");
    }

    removingVideos = false;
}

window.addEventListener('load', function () {
    removeRecommendedVideos();
    observer.observe(document.body, { childList: true, subtree: true });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const tags = message.message;
    console.log("Message received:", tags);
    localStorage.setItem("tags", tags);
    location.reload();
});

chrome.storage.local.get(["isClicked"]).then((result) => {
    console.log("Value is " + result.isClicked);
    const observer = new MutationObserver((mutations, obs) => {
        const sidebar = document.getElementById("secondary");
        if (sidebar) {
            if(result.isClicked === "true") {
                console.log("Value is correct");
                console.log("Sidebar removed successfully");
                sidebar.style.display = "none";
            } else {
                console.log("Value is incorrect");
                sidebar.style.display = "block";
            }
            obs.disconnect(); // Stop observing once the sidebar is found
        }
    });
    // Start observing the document for changes
    observer.observe(document, {
        childList: true,
        subtree: true
    });
});


chrome.storage.local.get(["isShorts"]).then((result) => {
    console.log("Value is " + result.isShorts);
    const observer = new MutationObserver((mutations, obs) => {
        const shortsSection = document.querySelector('ytd-rich-shelf-renderer');
        if (shortsSection) {
            if(result.isShorts === "true") {
                shortsSection.style.display = 'none';
                console.log("YouTube Shorts section removed.");
            } else {
                console.log("Value is incorrect");
                shortsSection.style.display = 'block';
            }
            obs.disconnect(); // Stop observing once the sidebar is found
        }else{
            console.log("YouTube Shorts section not found.");
        }

    });
    // Start observing the document for changes
    observer.observe(document, {
        childList: true,
        subtree: true
    });
});