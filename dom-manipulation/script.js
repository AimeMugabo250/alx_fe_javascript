


























// Corrected and clarified addQuote function
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim().toLowerCase();
  
  if (!text || !category) {
    alert('Please enter both quote text and category');
    return;
  }
  
  // Add to quotes array
  const newQuote = { text, category };
  quotes.push(newQuote);
  
  // Clear inputs
  textInput.value = '';
  categoryInput.value = '';
  
  // Update UI
  updateCategoryFilter();
  
  // Show confirmation (optional)
  console.log('New quote added:', newQuote);
}

// Correct event listener (already correct)
newQuoteBtn.addEventListener('click', showRandomQuote);
