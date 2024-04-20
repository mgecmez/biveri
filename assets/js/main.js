$(document).ready(async function () {
  getHeader();
  getFooter();
  cookieSettins();
});

function getHeader() {
  $('.hero-header-section').load('shared/header.html');
}

function getFooter() {
  $('.footer').load('shared/footer.html');
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
    $(".cookie-overlay").show();
    $(".cookie").addClass("active");
  } else {
    $(".cookie-overlay").hide();
    $(".cookie").removeClass("active");
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
