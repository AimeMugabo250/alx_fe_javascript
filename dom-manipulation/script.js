let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
      updateCategoryFilter();
    }

    function displayQuote(quote) {
      const display = document.getElementById('quoteDisplay');
      display.innerHTML = `<p class="quote-text">${quote.text}</p><p class="quote-category">Category: ${quote.category}</p>`;
    }

    function showRandomQuote() {
      const category = document.getElementById('categoryFilter').value;
      const filtered = category === 'all' ? quotes : quotes.filter(q => q.category === category);
      if (filtered.length === 0) {
        alert('No quotes available for this category.');
        return;
      }
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      displayQuote(random);
    }

    function addQuote() {
      const textInput = document.getElementById('newQuoteText');
      const categoryInput = document.getElementById('newQuoteCategory');
      const text = textInput.value.trim();
      const category = categoryInput.value.trim();
      if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        displayQuote({ text, category });
        textInput.value = '';
        categoryInput.value = '';
        alert('Quote added!');
      } else {
        alert('Please enter both quote text and category.');
      }
    }

    function updateCategoryFilter() {
      const select = document.getElementById('categoryFilter');
      const current = select.value;
      const categories = Array.from(new Set(quotes.map(q => q.category)));
      select.innerHTML = '<option value="all">All Categories</option>' + categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
      select.value = current;
    }

    function exportToJson() {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.getElementById('exportLink');
      link.href = url;
      link.style.display = 'inline';
      link.click();
    }

    function importFromJsonFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedQuotes = JSON.parse(e.target.result);
          if (Array.isArray(importedQuotes)) {
            quotes = importedQuotes;
            saveQuotes();
            alert('Quotes imported successfully!');
          } else {
            alert('Invalid format in imported file.');
          }
        } catch {
          alert('Failed to parse JSON.');
        }
      };
      reader.readAsText(file);
    }

    function clearLocalStorage() {
      if (confirm('Are you sure you want to clear all quotes?')) {
        localStorage.removeItem('quotes');
        quotes = [];
        updateCategoryFilter();
        document.getElementById('quoteDisplay').innerHTML = '<p class="quote-text">No quotes available.</p>';
        alert('All quotes cleared.');
      }
    }

    function resolveConflicts(option) {
      alert('Conflict resolution not implemented yet.');
    }

    function manualSync() {
      const time = new Date().toLocaleString();
      document.getElementById('lastSyncTime').textContent = time;
      document.getElementById('syncStatus').textContent = 'Synced';
    }

    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('resetFilter').addEventListener('click', () => {
      document.getElementById('categoryFilter').value = 'all';
    });
    document.getElementById('manualSync').addEventListener('click', manualSync);

    updateCategoryFilter();
