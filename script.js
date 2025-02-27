document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addCommentBtn = document.getElementById('addCommentBtn');
    const commentPopup = document.getElementById('commentPopup');
    const commentInput = document.getElementById('commentInput');
    const usernameInput = document.getElementById('usernameInput');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentsList = document.getElementById('commentsList');
    
    // Current reply target (null for top-level comments)
    let currentReplyTarget = null;
    
    // Initialize event listeners
    addCommentBtn.addEventListener('click', function() {
        // Reset current reply target for top-level comments
        currentReplyTarget = null;
        
        // Show the comment popup
        commentPopup.style.display = 'block';
        commentInput.focus();
    });
    
    cancelBtn.addEventListener('click', function() {
        // Hide the comment popup and reset inputs
        commentPopup.style.display = 'none';
        commentInput.value = '';
        usernameInput.value = '';
        
        // Reset any reply containers that were active
        const replyContainers = document.querySelectorAll('.reply-container');
        replyContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Move popup back to top if it was moved
        document.querySelector('.container').insertBefore(commentPopup, commentsList);
    });
    
    submitCommentBtn.addEventListener('click', function() {
        const commentText = commentInput.value.trim();
        const username = usernameInput.value.trim() || 'Anonymous';
        
        if (commentText) {
            // Get current date and time
            const now = new Date();
            const dateString = `Tue Feb ${now.getDate()} ${now.getFullYear()}`;
            
            // Create comment element
            const commentElement = createCommentElement(username, dateString, commentText);
            
            if (currentReplyTarget) {
                // If replying to a comment, add to its nested comments
                let nestedComments = currentReplyTarget.querySelector('.nested-comments');
                
                if (!nestedComments) {
                    // Create nested comments container if it doesn't exist
                    nestedComments = document.createElement('div');
                    nestedComments.className = 'nested-comments';
                    currentReplyTarget.appendChild(nestedComments);
                }
                
                nestedComments.appendChild(commentElement);
                
                // Hide the reply container and move popup back to top
                const replyContainer = currentReplyTarget.querySelector('.reply-container');
                if (replyContainer) {
                    replyContainer.style.display = 'none';
                }
                document.querySelector('.container').insertBefore(commentPopup, commentsList);
            } else {
                // Add to main comments list for top-level comments
                commentsList.appendChild(commentElement);
            }
            
            // Reset and hide the form
            commentInput.value = '';
            usernameInput.value = '';
            commentPopup.style.display = 'none';
            currentReplyTarget = null;
        }
    });
    
    // Generate random human-like avatars using DiceBear
    function getRandomAvatar(username) {
        // Using DiceBear's 'avataaars' collection for human-like avatars
        // Adding random seed for variety
        const random = Math.floor(Math.random() * 1000);
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}${random}`;
    }
    
    // Function to create a comment element
    function createCommentElement(username, date, text) {
        const comment = document.createElement('div');
        comment.className = 'comment';
        
        // Use DiceBear for avatar
        const avatarUrl = getRandomAvatar(username);
        
        comment.innerHTML = `
            <div class="comment-content">
                <div class="user-info">
                    <div class="avatar">
                        <img src="${avatarUrl}" alt="${username}">
                    </div>
                    <div>
                        <div class="user-name">${username}</div>
                        <div class="comment-date">${date}</div>
                    </div>
                </div>
                <div class="comment-text">${text}</div>
                <button class="reply-btn">
                    <i class="fas fa-reply"></i>
                    Reply
                </button>
                <div class="reply-container"></div>
            </div>
        `;
        
        // Add reply functionality
        const replyBtn = comment.querySelector('.reply-btn');
        const replyContainer = comment.querySelector('.reply-container');
        
        replyBtn.addEventListener('click', function() {
            // Set current reply target
            currentReplyTarget = comment;
            
            // Move the popup to the reply container
            replyContainer.style.display = 'block';
            replyContainer.appendChild(commentPopup);
            
            // Show popup and focus
            commentPopup.style.display = 'block';
            commentInput.focus();
        });
        
        return comment;
    }
});
