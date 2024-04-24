$(document).ready(async function () {
  getHeader();
  getFooter();
  getCtaSection();
  getBlogSection();

  cookieSettins();
});

function getHeader() {
  $('.hero-header-section').load('shared/header.html');
}

function getFooter() {
  $('.footer').load('shared/footer.html');
}

function getCtaSection() {
  $('.cta-section').load('shared/cta-section.html');
}

function getBlogSection() {
  $('.blog-section').load('shared/blog-section.html');
}

// function menuHover() {
//   $(".menu-item-base").hover(
//     function () {
//       $(this).find(".header-dropdown").addClass("show");
//       $(".hero-header-section").addClass("active");
//     },
//     function () {
//       $(this).find(".header-dropdown").removeClass("show");
//       $(".hero-header-section").removeClass("active");
//     }
//   );
// }

function cookieSettins() {
  var cookie = localStorage.getItem("biveri-cookie");
  if (!cookie) {
    $('.cookie-section').load('shared/cookie-section.html');

    $(".cookie-overlay").show();
    $(".cookie").addClass("active");
  } else {
    // $(".cookie-overlay").hide();
    // $(".cookie").removeClass("active");
  }
  // console.log(api);
  // api.run(config);
}

function acceptCookie() {
  localStorage.setItem(
    "biveri-cookie",
    JSON.stringify({
      expirationTime: new Date().getTime(),
    })
  );

  $(".cookie-overlay").hide();
  $(".cookie").removeClass("active");
}
