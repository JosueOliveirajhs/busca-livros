    function searchBooks() {
      const searchTerm = document.getElementById('searchInput').value.trim();
      
      if (!searchTerm) {
        alert('Por favor, digite algo para buscar');
        return;
      }

      document.getElementById('loading').style.display = 'flex';
      document.getElementById('noBooks').style.display = 'none';
      document.getElementById('resultsGrid').innerHTML = '';
      
      const category = document.getElementById('filterCategory').value;
      const sort = document.getElementById('filterSort').value;
      const lang = document.getElementById('filterLang').value;
      
      let url = `https://www.googleapis.com/books/v1/volumes?q=`;
      
      if (category) {
        url += `+subject:${category}`;
      }
      
      url += `+${encodeURIComponent(searchTerm)}`;
      
      if (sort === 'newest') {
        url += '&orderBy=newest';
      } else if (sort === 'oldest') {
        url += '&orderBy=relevance';
      }

      if (lang) {
        url += `&langRestrict=${lang}`;
      }
      
      url += '&maxResults=12';
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na resposta da API');
          }
          return response.json();
        })
        .then(data => {
          document.getElementById('loading').style.display = 'none';
          
          if (data.items && data.items.length > 0) {
            displayBooks(data.items);
          } else {
            document.getElementById('noBooks').style.display = 'block';
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          document.getElementById('loading').style.display = 'none';
          document.getElementById('noBooks').style.display = 'block';
        });
    }
    
    function displayBooks(books) {
      const resultsGrid = document.getElementById('resultsGrid');
      resultsGrid.innerHTML = '';
      
      books.forEach(book => {
        const volumeInfo = book.volumeInfo;
        const saleInfo = book.saleInfo;
        
        const bookCard = document.createElement('div');
        bookCard.className = 'col';
        
        bookCard.innerHTML = `
          <div class="book-card">
            <div class="book-cover">
              ${volumeInfo.imageLinks ? 
                `<img src="${volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}" alt="${volumeInfo.title}" class="img-fluid">` : 
                `<i class="fas fa-book"></i>`
              }
            </div>
            <div class="book-info">
              <h3 class="book-title">${volumeInfo.title}</h3>
              <p class="book-author">${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconhecido'}</p>
              <p class="book-description">${volumeInfo.description ? 
                volumeInfo.description.substring(0, 150) + '...' : 
                'Descrição não disponível.'}</p>
              <div class="book-meta">
                <span>${volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : 'N/A'}</span>
                <span>${volumeInfo.pageCount ? `${volumeInfo.pageCount} páginas` : ''}</span>
              </div>
            </div>
          </div>
        `;
        
        resultsGrid.appendChild(bookCard);
      });
    }
    
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchBooks();
      }
    });

    window.onload = function() {
      document.getElementById('searchInput').value = 'Harry Potter';
      searchBooks();
    };