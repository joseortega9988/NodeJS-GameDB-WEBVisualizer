// Initialize Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target.querySelector('video.lazy-video');
            if (video) {
                const src = video.getAttribute('data-src');
                if (src) {
                    video.src = src;
                }
                video.removeAttribute('data-src');
                observer.unobserve(entry.target);
            }
        }
    });
});

// Lazy-load videos as they come into the viewport
document.querySelectorAll('.video-container').forEach(container => {
    observer.observe(container);
});

// Load additional videos when scrolling
let loading = false;
function lazyLoadVisibleVideos() {
    if (loading) {
        return;
    }

    const containers = document.querySelectorAll('.video-container:not(.loaded)');
    containers.forEach(container => {
        if (isElementInViewport(container)) {
            loading = true;
            observer.observe(container);
            container.classList.add('loaded');
            setTimeout(() => {
                loading = false;
                lazyLoadVisibleVideos();
            }, 100); // Delay to prevent rapid loading
        }
    });
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

window.addEventListener('load', lazyLoadVisibleVideos);
window.addEventListener('scroll', lazyLoadVisibleVideos);
window.addEventListener('resize', lazyLoadVisibleVideos);



// Get the modal and the enlarged image
const modal = document.getElementById('screenshotModal');
const enlargedImage = document.getElementById('enlargedImage');

// Get all screenshot images
const screenshotImages = document.querySelectorAll('.screenshot-image');

// Add click event listeners to open modal with enlarged image
screenshotImages.forEach(image => {
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        enlargedImage.src = image.src;
    });
});

// Add click event listener to close modal
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
