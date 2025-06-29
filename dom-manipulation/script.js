    // Quote database
    let quotes = [];
    let currentFilter = 'all';

    // DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');
    const resetFilterBtn = document.getElementById('resetFilter');
    const exportLink = document.getElementById('exportLink');

    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
      loadQuotes();
      populateCategories();
      restoreFilter();
      
      // Set up event listeners
      newQuoteBtn.addEventListener('click', showRandomQuote);
      categoryFilter.addEventListener('change', filterQuotes);
      resetFilterBtn.addEventListener('click', resetFilter);
      
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
        populateCategories();
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
      localStorage.setItem('lastFilter', currentFilter);
    }

    // Populate categories dropdown
    function populateCategories() {
      // Clear existing options except "All Categories"
      while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
      }
      
      // Get all unique categories
      const categories = [...new Set(quotes.map(quote => quote.category))];
      
      // Add new category options
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }

    // Filter quotes based on selected category
    function filterQuotes() {
      currentFilter = categoryFilter.value;
      saveQuotes();
      showRandomQuote();
    }

    // Restore last used filter from storage
    function restoreFilter() {
      const lastFilter = localStorage.getItem('lastFilter');
      if (lastFilter) {
        currentFilter = lastFilter;
        categoryFilter.value = lastFilter;
      }
    }

    // Reset filter to show all categories
    function resetFilter() {
      currentFilter = 'all';
      categoryFilter.value = 'all';
      saveQuotes();
      showRandomQuote();
    }

    // Display a random quote
    function showRandomQuote() {
      let filteredQuotes = quotes;
      
      if (currentFilter !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === currentFilter);
      }
      
      if (filteredQuotes.length === 0) {
        const noQuotesMsg = currentFilter === 'all' 
          ? 'No quotes available. Add some new quotes!' 
          : `No quotes found in the "${currentFilter}" category.`;
        quoteDisplay.innerHTML = `<p class="quote-text">${noQuotesMsg}</p>`;
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      
      quoteDisplay.innerHTML = `
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-category">— ${quote.category}</p>
        <div>${getCategoryTags(quote.category)}</div>
      `;
      
      // Store last viewed quote in session storage
      sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    }

    // Generate category tags
    function getCategoryTags(category) {
      return `<span class="category-tag">${category}</span>`;
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
      populateCategories();
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
          populateCategories();
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
        localStorage.removeItem('lastFilter');
        sessionStorage.clear();
        quotes = [];
        populateCategories();
        quoteDisplay.innerHTML = '<p class="quote-text">No quotes available. Add some new quotes!</p>';
        currentFilter = 'all';
        categoryFilter.value = 'all';
        alert('All quotes have been cleared.');
      }
    }
