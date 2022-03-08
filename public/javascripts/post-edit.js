   // find post edit form
   let postEditform = document.getElementById('postEditForm');
   // and submit listener to post edit form
   postEditform.addEventListener('submit', function(event) {
       // find length of upload images
       let imageUploads = document.getElementById('imageUpload').files.length;
       // find total number of existing images
       let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
       // find the total number of potential deletions
       let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
       //  figure out if the form can be submitted or not
       let newTotal = existingImgs - imgDeletions + imageUploads;
       if (newTotal > 4 ) {
           event.preventDefault();
           let removalAmt = newtotal - 4;
           alert(`You need to remove at least ${removalAmt} (more) image${removalAmt === 1 ? });
       }
   });