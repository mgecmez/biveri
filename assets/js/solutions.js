$(document).ready(async function () {
  featureTabs();

  animation();

  markedPhone();
});

function featureTabs() {
  $('.product-features .tabs .tab').click(function() {
    var tabItem = $(this);
    var tabId = tabItem.attr('id');
    var isActive = tabItem.hasClass('active');
    
    if (!isActive) {
      $('.product-features .tabs .tab').removeClass('active');
      $('.product-features .content .heading-description').removeClass('active');

      tabItem.addClass('active');
      $(`.product-features .content #${tabId}.heading-description`).addClass('active');
    }
  });
}

function animation() {
  var slideTrack = $('.brand .companies .slide-track');

  brandCount = slideTrack.find('img').length;
  if (brandCount > 0) {
    var trackWidth = $(slideTrack).width();

    // Genişlik değerini slide-track'e uygula
    slideTrack.width(trackWidth + 'px');

    // Animasyonun süresini ve sonsuz döngüyü belirle
    var animationDuration = trackWidth / 100; // 100px/s hızında kaydırma yapmak için
    slideTrack.css('animation', 'scroll ' + animationDuration + 's linear infinite');

    // Animasyon için gereken keyframes
    var keyframes = '@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-' + ((trackWidth / 2) + 32) + 'px); } }';
    $('head').append('<style>' + keyframes + '</style>');
  }
}

function markedPhone() {
  const input = document.querySelector("#phone");
  const iti = window.intlTelInput(input, {
    initialCountry: 'auto',
    countrySearch: true,
    preferredCountries: [],
    autoPlaceholder:"polite",
    showSelectedDialCode: true,
    geoIpLookup: function(success, failure) {
      fetch("https://ipapi.co/json")
        .then(function(res) { return res.json(); })
        .then(function(data) { success(data.country_code); })
        .catch(function() { failure(); });
    }
  });
}