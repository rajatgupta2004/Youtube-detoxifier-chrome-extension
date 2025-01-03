let removingVideos = false;
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
            removeRecommendedVideos();
        }
    });
});

function removeRecommendedVideos() {
    if (removingVideos) return;
    removingVideos = true;
    var recommendedSection = document.querySelector('#secondary');

    if (recommendedSection) {
        var recommendedVideos = recommendedSection.querySelectorAll('ytd-compact-video-renderer, ytd-video-renderer');
        recommendedVideos.forEach(function(video) {
            video.style.display = 'none'; // Hide the videos instead of removing them
        });
    } else {
        console.log("Recommended videos section not found.");
    }
    removingVideos = false;
}

window.addEventListener('load', function() {
    removeRecommendedVideos();
    observer.observe(document.body, { childList: true, subtree: true });
});
