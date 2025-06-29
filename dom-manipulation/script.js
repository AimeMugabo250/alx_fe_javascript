  // Quote database
    let quotes = [
      { text: "The only way to do great work is to love what you do.", category: "inspiration" },
      { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
      { text: "Stay hungry, stay foolish.", category: "inspiration" },
      { text: "The journey of a thousand miles begins with one step.", category: "life" }
    ];

    // DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');

    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
      updateCategoryFilter();
      newQuoteBtn.addEventListener('click', showRandomQuote);
    });

    // Display a random quote
    function showRandomQuote() {
      const selectedCategory = categoryFilter.value;
      let filteredQuotes = quotes;
      
      if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
      }
      
      if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p class="quote-text">No quotes found in this category.</p>';
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      
      quoteDisplay.innerHTML = `
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-category">— ${quote.category}</p>
      `;
    }

    // Add a new quote
    function addQuote() {
      const textInput = document.getElementById('newQuoteText');
      const categoryInput = document.getElementById('newQuoteCategory');
      
      const text = textInput.value.trim();
      const category = categoryInput.value.trim().toLowerCase();
      
      if (!text || !category) {
        alert('Please enter both quote text and category');
        return;
      }
      
      quotes.push({ text, category });
      textInput.value = '';
      categoryInput.value = '';
      
      updateCategoryFilter();
      showRandomQuote();
      
      alert('Quote added successfully!');
    }

    // Add a new category
    function addCategory() {
      const categoryInput = document.getElementById('newCategory');
      const category = categoryInput.value.trim().toLowerCase();
      
      if (!category) {
        alert('Please enter a category name');
        return;
      }
      
      // Check if category already exists
      const existingCategories = Array.from(categoryFilter.options)
        .map(option => option.value);
      
      if (!existingCategories.includes(category)) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      }
      
      categoryInput.value = '';
      alert('Category added successfully!');
    }

    // Update category filter dropdown
    function updateCategoryFilter() {
      // Get all unique categories
      const categories = [...new Set(quotes.map(quote => quote.category))];
      
      // Clear existing options except "All Categories"
      while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
      }
      
      // Add new category options
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }
