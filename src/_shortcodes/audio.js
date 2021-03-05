const outdent = require('outdent')({ newline: ' ' });
module.exports = (path) => {
    return outdent`
    <figure>
        <figcaption>Musica consigliata</figcaption>
        <audio metadata controls src="/media/${path}">
        Your browser does not support the <code>audio</code> element</audio>
    </figure>`;
};
