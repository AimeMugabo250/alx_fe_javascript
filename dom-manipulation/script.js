 // Quote database
    let quotes = [];

    // DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');
    const exportLink = document.getElementById('exportLink');

    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
      loadQuotes();
      updateCategoryFilter();
      newQuoteBtn.addEventListener('click', showRandomQuote);
      
      // Load default quotes if storage is empty
      if (quotes.length === 0) {
        const defaultQuotes = [
          { text: "The only way to do great work is to love what you do.", category: "inspiration" },
          { text: "Innovation distinguishes between a leader and a follower.", category: "business" },
          { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
          { text: "Stay hungry, stay foolish.", category: "inspiration" },
          { text: "The journey of a thousand miles begins with one step.", category: "life" }
        ];
        quotes = defaultQuotes;
        saveQuotes();
      }
    });

    // Load quotes from local storage
    function loadQuotes() {
      const storedQuotes = localStorage.getItem('quotes');
      if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
      }
    }

    // Save quotes to local storage
    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
      sessionStorage.setItem('lastSaved', new Date().toISOString());
    }

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
      
      // Store last viewed quote in session storage
      sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
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
      
      // Check for duplicates
      const isDuplicate = quotes.some(quote => 
        quote.text.toLowerCase() === text.toLowerCase() && 
        quote.category.toLowerCase() === category.toLowerCase()
      );
      
      if (isDuplicate) {
        alert('This quote already exists in this category');
        return;
      }
      
      quotes.push({ text, category });
      textInput.value = '';
      categoryInput.value = '';
      
      saveQuotes();
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

    // Export quotes to JSON file
    function exportToJson() {
      const dataStr = JSON.stringify(quotes, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      exportLink.href = URL.createObjectURL(dataBlob);
      exportLink.download = 'quotes.json';
      exportLink.click();
    }

    // Import quotes from JSON file
    function importFromJsonFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        try {
          const importedQuotes = JSON.parse(e.target.result);
          
          if (!Array.isArray(importedQuotes)) {
            throw new Error('Invalid format: Expected an array of quotes');
          }
          
          // Validate each quote
          const validQuotes = importedQuotes.filter(quote => 
            quote.text && quote.category &&
            typeof quote.text === 'string' && 
            typeof quote.category === 'string'
          );
          
          if (validQuotes.length === 0) {
            throw new Error('No valid quotes found in the file');
          }
          
          quotes.push(...validQuotes);
          saveQuotes();
          updateCategoryFilter();
          showRandomQuote();
          alert(`Successfully imported ${validQuotes.length} quotes!`);
          
          // Reset file input
          event.target.value = '';
        } catch (error) {
          alert(`Error importing quotes: ${error.message}`);
          console.error('Import error:', error);
        }
      };
      fileReader.readAsText(file);
    }

    // Clear all quotes from storage
    function clearLocalStorage() {
      if (confirm('Are you sure you want to clear all quotes? This cannot be undone.')) {
        localStorage.removeItem('quotes');
        sessionStorage.clear();
        quotes = [];
        updateCategoryFilter();
        quoteDisplay.innerHTML = '<p class="quote-text">No quotes available. Add some new quotes!</p>';
        alert('All quotes have been cleared.');
      }
    }
