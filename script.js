async function fetchData(query) {
    const gallery = document.getElementById('gallery');
    const loader = document.getElementById('loader');
  
    gallery.innerHTML = ''; // Clear previous results
    loader.style.display = 'block'; // Show loader
  
    const apiUrl = `https://images-api.nasa.gov/search?q=${query}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.collection && data.collection.items.length > 0) {
        data.collection.items.forEach(item => {
          const links = item.links || [];
          const dataInfo = item.data[0];
          const title = dataInfo.title || 'No Title';
          const description = dataInfo.description || 'No Description';
          const mediaType = dataInfo.media_type || 'image';
  
          // Create a gallery item
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
  
          // Handle images and videos
          if (mediaType === 'image' && links.length > 0) {
            const image = links[0].href;
            galleryItem.innerHTML = `
              <img src="${image}" alt="${title}">
              <div class="info">
                <h3>${title}</h3>
                <p>${description}</p>
              </div>
            `;
          } else if (mediaType === 'video' && links.length > 0) {
            const video = links[0].href;
            galleryItem.innerHTML = `
              <video controls preload="metadata">
                <source src="${video}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="info">
                <h3>${title}</h3>
                <p>${description}</p>
              </div>
            `;
          }
  
          // Append the gallery item if valid content exists
          if (galleryItem.innerHTML) {
            gallery.appendChild(galleryItem);
          }
        });
      } else {
        gallery.innerHTML = '<p>No results found. Try a different category.</p>';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      gallery.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    } finally {
      loader.style.display = 'none'; // Hide loader
    }
  }
  
  document.getElementById('querySelection').addEventListener('change', (event) => {
    const selectedQuery = event.target.value;
    fetchData(selectedQuery); // Fetch data based on the selected category
  });
  
  // Fetch default category (moon) on page load
  fetchData('moon');
  