// Our cool text that will be typed out one letter at a time
const text = "The Production House";

// Grab the element where we'll show the typing effect.
// Make sure there's an element with the ID "typing-container" in your HTML.
const typingContainer = document.getElementById("typing-container");

// Set up our speed options (in milliseconds)
// typingSpeed controls how fast each character appears,
// and delayBetweenRepeats sets the pause before we start over.
const typingSpeed = 100; // 100ms between each character
const delayBetweenRepeats = 3000; // 3-second pause after finishing

// This keeps track of our current spot in the text string.
let index = 0;

// Function that handles the typing effect
function type() {
    // Add a little right border to mimic a blinking cursor
    typingContainer.style.borderRight = "1px solid black";

    // If we haven't typed the whole string yet...
    if (index < text.length) {
        // Add the next character to our container
        typingContainer.textContent += text[index];
        index++; // Move on to the next letter
        // Schedule the next character to be typed after a short pause
        setTimeout(type, typingSpeed);
    } else {
        // Once we're done, remove the cursor effect
        typingContainer.style.borderRight = "none";
        // Wait a bit before starting over (this assumes you have a resetAndRepeat function)
        setTimeout(resetAndRepeat, delayBetweenRepeats);
    }
}

// Kick off the typing animation when the page loads.
type();

// BUBBLE CLICK FUN

// Find all elements with the class "bubble" and add a click event listener to each.
document.querySelectorAll('.bubble').forEach(circle => {
  circle.addEventListener('click', (event) => {
      // Stop the click from bubbling up (so it doesn't trigger other stuff)
      event.stopPropagation();

      // Collapse any other bubble that might already be open
      document.querySelectorAll('.bubble').forEach(otherCircle => {
          if (otherCircle !== circle && otherCircle.classList.contains('expanded')) {
              otherCircle.classList.remove('expanded');
              if (otherCircle.typingInterval) {
                  clearInterval(otherCircle.typingInterval);
              }
              otherCircle.typingInterval = null;
              otherCircle.innerHTML = ''; // Clear out the text
          }
      });

      // Toggle this bubble: if it's not open, open it; if it is, close it.
      if (!circle.classList.contains('expanded')) {
          // Open it up by adding the expanded class.
          circle.classList.add('expanded');
          // Create a div that will hold our typed text.
          const text = document.createElement('div');
          text.id = 'text';
          text.textContent = ''; // Start with no text
          circle.appendChild(text);

          // Get the content for this bubble from its data attribute.
          // If nothing is set, use a default message.
          const bubbleText = circle.getAttribute('data-text') || "No content available.";
          // Start typing out the bubble's text using our helper function.
          circle.typingInterval = typeText(bubbleText, text);
      } else {
          // If it's already open, close it.
          circle.classList.remove('expanded');
          if (circle.typingInterval) {
              clearInterval(circle.typingInterval);
          }
          circle.typingInterval = null;
          circle.innerHTML = ''; // Remove the text
      }
  });
});

// If you click anywhere on the document (outside a bubble),
// close any bubbles that are open.
document.addEventListener('click', () => {
  document.querySelectorAll('.bubble').forEach(circle => {
      if (circle.classList.contains('expanded')) {
          circle.classList.remove('expanded');
          if (circle.typingInterval) {
              clearInterval(circle.typingInterval);
          }
          circle.typingInterval = null;
          circle.innerHTML = '';
      }
  });
});


// HELPER FUNCTION: TYPING TEXT INSIDE BUBBLES

/**
 * Types out the provided content into the given element, one character at a time.
 * @param {string} content - The text to show.
 * @param {HTMLElement} element - The element where the text will appear.
 * @returns {number} - The interval ID so we can clear it if needed.
 */
function typeText(content, element) {
  // Make sure our text element is visible
  element.style.display = 'block';
  let index = 0;
  // Set up an interval to add a new character every 30ms
  const interval = setInterval(() => {
      if (index < content.length) {
          element.textContent += content[index];
          index++;
      } else {
          clearInterval(interval); // Stop when we're done
      }
  }, 30);
  return interval;
}

// HOUSE SVG ZOOM & TRANSITION

// Get the main container, the SVG of the house, and the door element
const bodyContainer = document.querySelector('.body-container');
const houseSvg = document.getElementById('house-svg');
const door = document.getElementById('door');

// When you click the door, trigger an animation and then navigate to another page.
door.addEventListener('click', (event) => {
  // Stop the event from bubbling up (so other click events don't fire)
  event.stopPropagation();

  // Get the size and position of the container element
  const bodyContainerRect = bodyContainer.getBoundingClientRect();

  // Get the size and position of the door element
  const doorRect = door.getBoundingClientRect();

  // Figure out the door's center point
  const doorCenterX = doorRect.left + doorRect.width / 2;
  const doorCenterY = doorRect.top + doorRect.height / 2;

  // Calculate the door's center relative to the body container
  const doorCenterXRelativeToBody = doorCenterX - bodyContainerRect.left;
  const doorCenterYRelativeToBody = doorCenterY - bodyContainerRect.top;

  // Convert those coordinates into percentages relative to the container's size
  const doorCenterXPercent = (doorCenterXRelativeToBody / bodyContainerRect.width) * 100;
  const doorCenterYPercent = (doorCenterYRelativeToBody / bodyContainerRect.height) * 100;

  // Set the transform origin so the zoom focuses on the door
  bodyContainer.style.transformOrigin = `${doorCenterXPercent}% ${doorCenterYPercent}%`;
  // Add a smooth transition for the zoom
  bodyContainer.style.transition = 'transform 1.5s ease-in-out';
  // Zoom in (scale up the container); adjust the scale factor as needed.
  bodyContainer.style.transform = `scale(10)`;

  // Fade all the elements inside the house SVG to white.
  const elements = houseSvg.querySelectorAll('*');
  elements.forEach((el) => {
    el.style.transition = 'fill 1.5s ease, stroke 1.5s ease';
    el.style.fill = 'white';
    el.style.stroke = 'white';
    // Remove any extra visual effects
    el.style.filter = 'none';
  });

  // Prevent further clicks on the door during the animation
  door.style.pointerEvents = 'none';

  // After 1.5 seconds, navigate to the inside page
  setTimeout(() => {
    window.location.href = 'inside.html';
  }, 1500);
});

// BACKGROUND MUSIC SETUP

// When the DOM is ready, set the background music volume.
document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('background-music');
  backgroundMusic.volume = 1; // Full volume
});

// Set up the audio control button functionality after the DOM is loaded.
document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('background-music');
  const audioControl = document.getElementById('audio-control');
  const audioIcon = document.getElementById('audio-icon');

  // Start off with the audio muted.
  backgroundMusic.muted = true;

  // When the audio control button is clicked, toggle the audio.
  audioControl.addEventListener('click', () => {
    if (backgroundMusic.muted) {
      // Unmute and try to play the music.
      backgroundMusic.muted = false;
      backgroundMusic.play().catch((err) => {
        console.warn("Autoplay might be blocked by the browser:", err);
      });
      // Update the icon to show sound is on.
      audioIcon.textContent = '🔊';
    } else {
      // Mute the music.
      backgroundMusic.muted = true;
      // Update the icon to show it's muted.
      audioIcon.textContent = '🔇';
    }
  });
});
