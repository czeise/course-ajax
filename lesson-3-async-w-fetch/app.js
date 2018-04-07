(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            {
                headers: {
                    Authorization: 'Client-ID c46b209e2144c86bea43b2e50432b25aa2e8cabc32ecb0bdd949b853361db660'
                }
            }
        ).then(response => response.json())
            .then(addImage)
            .catch(error => requestError(error, 'image'));

        fetch(
            `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=0b8fecc045a24ff9bba7454ff972d3bc`
        ).then(response => response.json())
            .then(addArticles)
            .catch(error => requestError(error, 'articles'));
    });

    function addImage(images) {
        let htmlContent = '';

        if (images && images.results && images.results[0]) {
            // Random result image
            const image = images.results[Math.floor(Math.random() * images.results.length)];

            htmlContent =
                `<figure>
                    <img src="${image.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${image.user.name}</figcaption>
                </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(articles) {
        let htmlContent = '';

        if (articles.response && articles.response.docs && articles.response.docs.length > 1) {
            htmlContent =
                '<ul>' +
                    articles.response.docs.map(article => `<li class="article">
                        <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                        <p>${article.snippet}</p>
                    </li>`).join('') +
                '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML(
            'beforeend',
            `<p class="network-warning">
                Oh no! There was an error making a request for the ${part}.
            </p>`
        );
    }

})();
